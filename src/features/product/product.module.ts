import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/model/product.model'
import { ProductResolver } from './product.resolver'
import { ProductImage } from '@feature/product/model/image.model'
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'
import { SpecificationModule } from '@feature/product/features/specification/specification.module'
import { RatingModule } from '@feature/product/features/rating/rating.module'
import { ProductAdminResolver } from '@feature/product/product.resolver.admin'

@Module({
  imports: [
    BrandModule,
    CategoryModule,
    SpecificationModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
    RatingModule,
  ],
  providers: [ProductService, ProductResolver, ProductAdminResolver],
})
export class ProductModule {}
