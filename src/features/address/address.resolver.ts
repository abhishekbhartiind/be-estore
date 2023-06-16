import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'
import { Address } from '@feature/address/model/address.model'
import { AddressService } from '@feature/address/address.service'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { Role } from '@feature/user/enum/role.enum'
import { User } from '@feature/user/user.model'
import { AddressFilterArgs } from '@feature/address/dto/filter.args'
import { CreateAddressInput } from '@feature/address/dto/create-address.input'
import { UpdateAddressInput } from '@feature/address/dto/update-address.input'

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => [Address])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async addresses(
    @CurrentUser() user: User,
    @Args('filterArgs', { nullable: true }) filterArgs?: AddressFilterArgs,
  ): Promise<Address[]> {
    return await this.addressService.fetch({
      userId: user.id,
      type: filterArgs?.type && filterArgs?.type,
      primary: filterArgs?.primary && filterArgs?.primary,
    })
  }

  @Mutation(() => Address)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createAddress(
    @CurrentUser() user: User,
    @Args('data') address: CreateAddressInput,
  ): Promise<Address> {
    return await this.addressService.save({ ...address, user })
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async swapPrimaryAddress(
    @CurrentUser() user: User,
    @Args('addressId') addressId: string,
  ): Promise<UpdateResult> {
    return await this.addressService.swapPrimary(addressId, user.id as string)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async updateCustomerAddress(
    @Args('id', { type: () => String }) id: string,
    @Args('data') address: UpdateAddressInput,
  ): Promise<UpdateResult> {
    return await this.addressService.update(id, address)
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async deleteAddress(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DeleteResult> {
    return await this.addressService.delete(id)
  }
}
