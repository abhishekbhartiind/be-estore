import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/product.model'

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
})
export class ProductModule {}
