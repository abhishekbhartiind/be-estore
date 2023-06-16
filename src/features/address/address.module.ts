import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressResolver } from '@feature/address/address.resolver'
import { AddressService } from '@feature/address/address.service'
import { Address } from '@feature/address/model/address.model'
import { AddressAdminResolver } from '@feature/address/address.resolver.admin'

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService, AddressResolver, AddressAdminResolver],
  exports: [AddressService],
})
export class AddressModule {}
