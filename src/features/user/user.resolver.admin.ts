import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'
import { UserService } from '@feature/user/user.service'
import { UseGuards } from '@nestjs/common'
import { HasRoles } from '@shared/decorator/role.decorator'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { Role } from '@feature/user/enum/role.enum'
import { UpdateUserInput } from '@feature/user/dto/update-user.input'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'

@Resolver(() => User)
export class UserAdminResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async users(): Promise<User[]> {
    return await this.userService.fetch()
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    return (await this.userService.fetchOne({ id })) as User
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('data') user: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(id, user)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async deleteUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<IDeleteResponse> {
    return await this.userService.delete(id)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<IUpdateResponse> {
    return await this.userService.restore(id)
  }
}
