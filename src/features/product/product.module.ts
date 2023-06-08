import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/model/product.model'
import { ProductResolver } from './product.resolver'
import { ProductImage } from '@feature/product/model/image.model'
import { ProductRating } from '@feature/product/model/rating.model'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductRating])],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
