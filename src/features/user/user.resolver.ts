import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'
import { UserService } from '@feature/user/user.service'
import { UseGuards } from '@nestjs/common'
import { HasRoles } from '@shared/decorator/role.decorator'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { Role } from '@feature/user/enum/role.enum'
import { UpdateUserInput } from '@feature/user/dto/update-user.input'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async fetchCustomer(@CurrentUser() user: User) {
    return await this.userService.fetchOne({ id: user.id as string })
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async updateCustomer(
    @CurrentUser() user: User,
    @Args('data') newUserData: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(user.id as string, newUserData)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async deleteCustomer(@CurrentUser() user: User): Promise<IDeleteResponse> {
    return await this.userService.delete(user.id as string)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async restoreCustomer(@CurrentUser() user: User): Promise<IUpdateResponse> {
    return await this.userService.restore(user.id as string)
  }

  @Mutation(() => User)
  async activateCustomer(@Args('token') token: string): Promise<User> {
    return await this.userService.activateAccount(token)
  }
}
