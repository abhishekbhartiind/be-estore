import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '@feature/user/user.service'
import { JwtService } from '@nestjs/jwt'
import {
  ACCOUNT_CREATED,
  ACCOUNT_EXISTS,
  ACCOUNT_NOT_FOUND,
  EMAIL_CHANGE_REQUEST_CREATED,
  INVALID_CREDENTIALS,
  PASSWORD_CHANGE_REQUEST_CREATED,
} from '@shared/features/auth/constant/response.constant'
import { User } from '@feature/user/user.model'
import { TOKEN_TYPES } from '@shared/features/auth/constant/token-type.constant'
import { LoginResponse } from '@shared/features/auth/model/login-response.model'
import { LoginUserInput } from '@shared/features/auth/dto/login-user.input'
import { RegisterResponse } from '@shared/features/auth/model/register-response.model'
import { compare } from 'bcrypt'
import { randomUUID } from 'crypto'
import { EmailResponse } from '@shared/features/auth/model/email-response.model'
import { MailerService } from '@nestjs-modules/mailer'
import { RegisterUserInput } from '@shared/features/auth/dto/register-user.input'
import {
  ACTIVATE_ACCOUNT,
  CHANGE_EMAIL,
  PASSWORD_REQUEST,
  SUBJECT,
} from '@shared/features/mail/constant/email.constant'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  /**
   * Validates user input for existing emails in DB and matching password (comparing hash and user password input)
   * @param email
   * @param password
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | undefined> {
    const userFound = await this.userService.fetchOne(null, { email })
    if (!userFound) {
      throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.UNAUTHORIZED)
    }

    const passwordMatches = await compare(password, userFound.password)
    if (!passwordMatches) {
      throw await new HttpException(
        INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (userFound && passwordMatches) {
      const { password, ...rest } = userFound
      return rest
    }
    return undefined
  }
  async register(user: RegisterUserInput): Promise<RegisterResponse> {
    console.log(user)
    const { email } = user
    const userFound = await this.userService.fetchOne(null, { email })
    if (userFound)
      throw new HttpException(ACCOUNT_EXISTS, HttpStatus.UNAUTHORIZED)

    let status: RegisterResponse = {
      success: false,
      message: '',
    }

    try {
      await this.userService.save(user).then(async () => {
        status.success = true
        status.message = ACCOUNT_CREATED
        await this.sendAccountActivationMail(email)
      })
    } catch (error) {
      status = {
        success: false,
        message: error,
      }
      console.log('status:')
      console.log(status)
      return status
    }
    if (!status.success) {
      throw new HttpException(status.message, HttpStatus.BAD_REQUEST)
    }
    return status
  }
  async login(userInput: LoginUserInput): Promise<LoginResponse> {
    const user = await this.userService.fetchOne(null, {
      email: userInput.email,
    })
    if (!user)
      throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.UNAUTHORIZED)

    const { id, email, role, activated } = user

    const payload = { sub: id, email, role, activated }
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    }
  }
  async verifyToken(token: string, option: string): Promise<boolean> {
    if (option === TOKEN_TYPES.PASSWORD_RESET) {
      const userFound = await this.userService.fetchOne(null, {
        passwordToken: token,
      })
      return !!userFound
    } else if (option === TOKEN_TYPES.ACCOUNT_ACTIVATION) {
      const userFound = await this.userService.fetchOne(null, {
        activationToken: token,
      })
      return !!userFound
    } else if (option === TOKEN_TYPES.EMAIL_CHANGE) {
      const userFound = await this.userService.fetchOne(null, {
        emailToken: token,
      })
      return !!userFound
    }
    return false
  }
  async setToken(id: string, token: string, option: string): Promise<User> {
    try {
      const userFound = await this.userService.fetchOne(id, undefined)
      if (!userFound)
        throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.UNAUTHORIZED)

      if (option === TOKEN_TYPES.ACCOUNT_ACTIVATION)
        userFound.activationToken = token

      if (option === TOKEN_TYPES.PASSWORD_RESET) {
        userFound.passwordToken = token
        userFound.passwordTokenCreated = new Date()
      }

      if (option === TOKEN_TYPES.EMAIL_CHANGE) {
        userFound.emailToken = token
        userFound.emailTokenCreated = new Date()
      }

      return await this.userService.update(id, userFound)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async sendPasswordChangeMail(email: string): Promise<EmailResponse> {
    try {
      const userFound = await this.userService.fetchOne(null, { email })
      if (!userFound)
        throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.UNAUTHORIZED)

      const token = randomUUID()
      await this.setToken(
        userFound.id as string,
        token,
        TOKEN_TYPES.PASSWORD_RESET,
      )

      return await this.mailService
        .sendMail({
          to: email,
          subject: `${SUBJECT} - ${PASSWORD_REQUEST}`,
          template: 'password-reset.template.hbs',
          context: {
            resetLink: `${process.env.FE_HOST}/${process.env.FRONTEND_PASSWORD_RESET}?token=${token}`,
            website: `${process.env.FE_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
            email,
          },
        })
        .then((response: any) => {
          return {
            success: true,
            message: PASSWORD_CHANGE_REQUEST_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error: any) => {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async sendAccountActivationMail(email: string): Promise<EmailResponse> {
    try {
      const userFound = await this.userService.fetchOne(null, { email })
      if (!userFound)
        throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.UNAUTHORIZED)

      const activationToken = randomUUID()
      await this.setToken(
        userFound.id as string,
        activationToken,
        TOKEN_TYPES.ACCOUNT_ACTIVATION,
      )

      return await this.mailService
        .sendMail({
          to: email,
          subject: `${SUBJECT} - ${ACTIVATE_ACCOUNT}`,
          template: 'account-activation.template.hbs',
          context: {
            activationLink: `${process.env.FE_HOST}/${process.env.FRONTEND_ACCOUNT_ACTIVATION}?token=${activationToken}`,
            website: `${process.env.FE_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
          },
        })
        .then((response: any) => {
          return {
            success: true,
            message: ACCOUNT_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error: any) => {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async sendEmailChangeMail(
    email: string,
    oldEmail: string,
  ): Promise<EmailResponse> {
    try {
      const emailExists = await this.userService.fetchOne(null, { email })
      if (emailExists)
        throw new HttpException(ACCOUNT_EXISTS, HttpStatus.UNAUTHORIZED)

      const userFound = await this.userService.fetchOne(null, {
        email: oldEmail,
      })

      const emailToken = randomUUID()
      await this.setToken(
        userFound?.id as string,
        emailToken,
        TOKEN_TYPES.EMAIL_CHANGE,
      )

      return await this.mailService
        .sendMail({
          to: email,
          subject: `${SUBJECT} - ${CHANGE_EMAIL}`,
          template: 'email-change.template.hbs',
          context: {
            changeLink: `${process.env.FE_HOST}/${process.env.FRONTEND_EMAIL_CHANGE}?token=${emailToken}`,
            website: `${process.env.FE_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
            email: oldEmail,
          },
        })
        .then((response: any) => {
          return {
            success: true,
            message: EMAIL_CHANGE_REQUEST_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error: any) => {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
