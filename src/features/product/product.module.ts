import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/model/product.model'
import { ProductResolver } from './product.resolver'
import { ProductImage } from '@feature/product/model/image.model'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductCategory } from '@feature/product/model/category.model'
import { ProductBrand } from '@feature/product/model/brand.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductBrand,
      ProductCategory,
      ProductImage,
      ProductRating,
    ]),
  ],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
