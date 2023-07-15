import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { HasRoles } from '@shared/decorator/role.decorator'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { Address } from '@feature/address/model/address.model'
import { AddressService } from '@feature/address/address.service'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { Role } from '@feature/user/enum/role.enum'
import { UpdateAddressInput } from '@feature/address/dto/update-address.input'

@Resolver(() => Address)
export class AddressAdminResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateAddress(
    @Args('id', { type: () => String }) id: string,
    @Args('data') address: UpdateAddressInput,
  ): Promise<IUpdateResponse> {
    return await this.addressService.update(id, address)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreAddress(
    @Args('id', { type: () => String }) id: string,
  ): Promise<IUpdateResponse> {
    return await this.addressService.restore(id)
  }
}
