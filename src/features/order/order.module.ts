import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@feature/order/model/order.model'
import { OrderService } from '@feature/order/order.service'
import { OrderResolver } from '@feature/order/order.resolver'
import { UserModule } from '@feature/user/user.module'
import { ProductModule } from '@feature/product/product.module'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'

@Module({
  imports: [
    ProductModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderHasProduct]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
