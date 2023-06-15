import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/product.model'
import { ProductResolver } from './product.resolver'
import { ProductImage } from '@feature/product/model/image.model'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductSpecification } from '@feature/product/model/specification.model'
import { SpecificationDisplay } from '@feature/product/model/specification/display.model'
import { SpecificationConnectivity } from '@feature/product/model/specification/connectivity.model'
import { SpecificationCPU } from '@feature/product/model/specification/cpu.model'
import { SpecificationBattery } from '@feature/product/model/specification/battery.model'
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'

@Module({
  imports: [
    BrandModule,
    CategoryModule,
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductRating,
      ProductSpecification,
      SpecificationBattery,
      SpecificationConnectivity,
      SpecificationCPU,
      SpecificationDisplay,
    ]),
  ],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
