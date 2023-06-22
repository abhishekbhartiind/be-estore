import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '@shared/features/auth/auth.service'
import { UserService } from '@feature/user/user.service'
import { RegisterResponse } from '@shared/features/auth/model/register-response.model'
import { UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '@shared/features/auth/guard/local-auth.guard'
import { LoginResponse } from '@shared/features/auth/model/login-response.model'
import { LoginUserInput } from '@shared/features/auth/dto/login-user.input'
import { EmailResponse } from '@shared/features/auth/model/email-response.model'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { Role } from '@feature/user/enum/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { User } from '@feature/user/user.model'
import { TokenVerificationResponse } from '@shared/features/auth/model/token-response.model'
import { ChangePasswordInput } from '@shared/features/auth/dto/change-password.input'
import { ChangeEmailInput } from '@shared/features/auth/dto/change-email.input'
import { UpdateResult } from '@shared/dto/typeorm-result.dto'
import { RegisterUserInput } from '@shared/features/auth/dto/register-user.input'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => RegisterResponse)
  async signUp(
    @Args('data') registerCredentials: RegisterUserInput,
  ): Promise<RegisterResponse> {
    const { firstName, lastName, email, avatar, password, phone } =
      registerCredentials
    const payload = {
      ...(avatar && { avatar }),
      firstName,
      lastName,
      email,
      password,
      ...(phone && { phone }),
    }

    return await this.authService.register(payload)
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse, { nullable: true })
  async signIn(
    @Args('data') loginCredentials: LoginUserInput,
  ): Promise<LoginResponse> {
    return await this.authService.login(loginCredentials)
  }

  @Query(() => EmailResponse)
  async requestPasswordChange(@Args('email') email: string) {
    return await this.authService.sendPasswordChangeMail(email)
  }

  @Query(() => EmailResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async requestEmailChange(
    @Args('email') email: string,
    @CurrentUser() user: User,
  ) {
    return await this.authService.sendEmailChangeMail(email, user.email)
  }

  @Query(() => TokenVerificationResponse)
  async verifyToken(
    @Args('token') token: string,
    @Args('tokenOption') tokenOption: string,
  ) {
    const response = await this.authService.verifyToken(token, tokenOption)
    if (response) {
      return { valid: true }
    } else {
      return { valid: false }
    }
  }

  @Mutation(() => UpdateResult)
  async changePassword(
    @Args('data') passwordChangeParams: ChangePasswordInput,
  ) {
    const { token, password } = passwordChangeParams
    return await this.userService.changePassword(token, password)
  }

  @Mutation(() => UpdateResult)
  async changeEmail(@Args('data') emailChangeParams: ChangeEmailInput) {
    const { token, email } = emailChangeParams
    return await this.userService.changeEmail(token, email)
  }
}
