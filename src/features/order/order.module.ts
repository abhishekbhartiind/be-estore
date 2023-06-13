import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@feature/order/order.model'

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
})
export class OrderModule {}
