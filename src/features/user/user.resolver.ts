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
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async fetchCustomer(@CurrentUser() user: User) {
    return await this.userService.fetchOne(user.id as string)
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

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async removeCustomer(@CurrentUser() user: User): Promise<DeleteResult> {
    return await this.userService.delete(user.id as string)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async restoreCustomer(@CurrentUser() user: User): Promise<UpdateResult> {
    return await this.userService.restore(user.id as string)
  }

  @Mutation(() => User)
  async activateCustomer(@Args('token') token: string): Promise<User> {
    return await this.userService.activateAccount(token)
  }
}
