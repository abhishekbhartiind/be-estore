import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from '@shared/features/auth/auth.service'
import { UserService } from '@feature/user/user.service'
import { IRegisterResponse } from '@shared/features/auth/model/register-response.model'
import { UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '@shared/features/auth/guard/local-auth.guard'
import { ILoginResponse } from '@shared/features/auth/model/login-response.model'
import { IEmailResponse } from '@shared/features/auth/model/email-response.model'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { Role } from '@feature/user/enum/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { User } from '@feature/user/user.model'
import { TokenVerificationResponse } from '@shared/features/auth/model/token-response.model'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { RegisterInput } from '@shared/features/auth/dto/register.input'
import { LoginInput } from '@shared/features/auth/dto/login.input'
import { EmailChangeInput } from '@shared/features/auth/dto/email-change.input'
import { PasswordChangeInput } from '@shared/features/auth/dto/password-change.input'
import { TokenVerifyInput } from '@shared/features/auth/dto/token-verify.input'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => IRegisterResponse)
  async signUp(
    @Args('input') registerArgs: RegisterInput,
  ): Promise<IRegisterResponse> {
    const { firstName, lastName, email, avatar, password, phone } = registerArgs

    return await this.authService.register({
      ...(avatar && { avatar }),
      firstName,
      lastName,
      email,
      password,
      ...(phone && { phone }),
    })
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => ILoginResponse, { nullable: true })
  async signIn(@Args('input') loginArgs: LoginInput): Promise<ILoginResponse> {
    return this.authService.login(loginArgs.email)
  }

  @Query(() => IEmailResponse)
  async requestPasswordChange(@Args('email') email: string) {
    return await this.authService.sendPasswordChangeMail(email)
  }

  @Query(() => IEmailResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async requestEmailChange(
    @Args('email') email: string,
    @CurrentUser() user: User,
  ) {
    return await this.authService.sendEmailChangeMail(email, user.email)
  }

  @Query(() => TokenVerificationResponse)
  async verifyToken(@Args('token') tokenVerifyArgs: TokenVerifyInput) {
    const response = await this.authService.verifyToken(tokenVerifyArgs)
    if (response) return { valid: true }
    else return { valid: false }
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
