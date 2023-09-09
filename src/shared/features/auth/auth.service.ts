import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '@feature/user/user.service'
import { JwtService } from '@nestjs/jwt'
import {
  ACCOUNT_CREATED,
  ACCOUNT_EXISTS,
  ACCOUNT_NOT_FOUND,
  EMAIL_ALREADY_TAKEN,
  EMAIL_CHANGE_REQUEST_CREATED,
  INVALID_CREDENTIALS,
  PASSWORD_CHANGE_REQUEST_CREATED,
} from '@shared/features/auth/constant/response.constant'
import { User } from '@feature/user/user.model'
import { TOKEN_TYPES } from '@shared/features/auth/constant/token-type.constant'
import { ILoginResponse } from '@shared/features/auth/model/login-response.model'
import { IRegisterResponse } from '@shared/features/auth/model/register-response.model'
import { compare } from 'bcrypt'
import { randomUUID } from 'crypto'
import { IEmailResponse } from '@shared/features/auth/model/email-response.model'
import { MailerService } from '@nestjs-modules/mailer'
import { RegisterInput } from '@shared/features/auth/dto/register.input'
import {
  ACTIVATE_ACCOUNT,
  CHANGE_EMAIL,
  PASSWORD_REQUEST,
  SUBJECT,
} from '@shared/features/mail/constant/email.constant'
import * as process from 'process'
import { TokenVerifyInput } from '@shared/features/auth/dto/token-verify.input'

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
  async validateUser(email: string, password: string): Promise<Partial<User>> {
    try {
      const userFound = await this.userService.fetchOne({ email })
      if (!userFound) {
        throw new UnauthorizedException(ACCOUNT_NOT_FOUND)
      }

      const passwordMatches = await compare(password, userFound.password)
      if (!passwordMatches) {
        throw new UnauthorizedException(INVALID_CREDENTIALS)
      }

      if (userFound && passwordMatches) {
        const { password, ...rest } = userFound
        return rest
      }
      throw new InternalServerErrorException()
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async register(user: RegisterInput): Promise<IRegisterResponse> {
    try {
      const { email } = user
      const userFound = await this.userService.fetchOne({ email })

      if (userFound) throw new UnauthorizedException(ACCOUNT_EXISTS)

      try {
        await this.userService.save(user).then(async () => {
          await this.sendAccountActivationMail(email)
          return {
            success: true,
          }
        })
      } catch (error) {
        return {
          success: false,
        }
      }

      throw new InternalServerErrorException()
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async login(userEmail: string): Promise<ILoginResponse> {
    try {
      const user = await this.userService.fetchOne({
        email: userEmail,
      })
      if (!user) throw new UnauthorizedException(ACCOUNT_NOT_FOUND)

      const { id, email, role } = user

      const payload = { sub: id, email, role }

      return {
        user,
        token: this.jwtService.sign(payload),
      }
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async verifyToken(tokenVerifyArgs: TokenVerifyInput): Promise<boolean> {
    try {
      const { token, tokenOption } = tokenVerifyArgs

      if (tokenOption === TOKEN_TYPES.ACCOUNT_ACTIVATION) {
        return !!(await this.userService.fetchOne({
          activationToken: token,
        }))
      } else if (tokenOption === TOKEN_TYPES.EMAIL_CHANGE) {
        return !!(await this.userService.fetchOne({
          emailToken: token,
        }))
      } else if (tokenOption === TOKEN_TYPES.PASSWORD_RESET) {
        return !!(await this.userService.fetchOne({
          passwordToken: token,
        }))
      }
      return false
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async setToken(id: string, token: string, option: string): Promise<User> {
    try {
      const userFound = await this.userService.fetchOne({ id })
      if (!userFound) throw new UnauthorizedException()

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
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async sendPasswordChangeMail(email: string): Promise<IEmailResponse> {
    try {
      const userFound = await this.userService.fetchOne({ email })
      if (!userFound) throw new UnauthorizedException(ACCOUNT_NOT_FOUND)

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
            resetLink: `${process.env.FRONTEND_HOST}/${process.env.FRONTEND_PASSWORD_RESET}?token=${token}`,
            website: `${process.env.FRONTEND_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
            email,
          },
        })
        .then((response) => {
          return {
            success: true,
            message: PASSWORD_CHANGE_REQUEST_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error) => {
          Logger.error(error)
          throw new InternalServerErrorException()
        })
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async sendAccountActivationMail(email: string): Promise<IEmailResponse> {
    try {
      const userFound = await this.userService.fetchOne({ email })
      if (!userFound) throw new UnauthorizedException(ACCOUNT_NOT_FOUND)

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
            activationLink: `${process.env.FRONTEND_HOST}/${process.env.FRONTEND_ACCOUNT_ACTIVATION}?token=${activationToken}`,
            website: `${process.env.FRONTEND_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
          },
        })
        .then((response) => {
          return {
            success: true,
            message: ACCOUNT_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error) => {
          Logger.error(error)
          throw new InternalServerErrorException()
        })
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async sendEmailChangeMail(
    email: string,
    oldEmail: string,
  ): Promise<IEmailResponse> {
    try {
      const emailExists = await this.userService.fetchOne({ email })
      if (emailExists)
        throw new InternalServerErrorException(EMAIL_ALREADY_TAKEN)

      const userFound = await this.userService.fetchOne({
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
            changeLink: `${process.env.FRONTEND_HOST}/${process.env.FRONTEND_EMAIL_CHANGE}?token=${emailToken}`,
            website: `${process.env.FRONTEND_HOST}`,
            name: email.slice(0, email.indexOf('@')),
            date: new Date().getFullYear(),
            email: oldEmail,
          },
        })
        .then((response) => {
          return {
            success: true,
            message: EMAIL_CHANGE_REQUEST_CREATED,
            rejected: response.rejected,
          }
        })
        .catch((error) => {
          Logger.error(error)
          throw new InternalServerErrorException()
        })
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
