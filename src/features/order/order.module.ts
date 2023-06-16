import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@feature/order/model/order.model'
import { OrderService } from '@feature/order/order.service'
import { OrderResolver } from '@feature/order/order.resolver'
import { UserModule } from '@feature/user/user.module'
import { ProductModule } from '@feature/product/product.module'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'
import { AddressModule } from '@feature/address/address.module'

@Module({
  imports: [
    AddressModule,
    ProductModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderHasProduct]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
