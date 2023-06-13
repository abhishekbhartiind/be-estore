import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '@feature/product/product.service'
import { Product } from '@feature/product/product.model'
import { ProductResolver } from './product.resolver'
import { ProductImage } from '@feature/product/model/image.model'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductCategory } from '@feature/product/model/category.model'
import { ProductBrand } from '@feature/product/model/brand.model'
import { ProductSpecification } from '@feature/product/model/specification.model'
import { SpecificationDisplay } from '@feature/product/model/specification/display.model'
import { SpecificationConnectivity } from '@feature/product/model/specification/connectivity.model'
import { SpecificationCPU } from '@feature/product/model/specification/cpu.model'
import { SpecificationDataStorage } from '@feature/product/model/specification/data-storage.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductBrand,
      ProductCategory,
      ProductImage,
      ProductRating,
      ProductSpecification,
      SpecificationConnectivity,
      SpecificationCPU,
      SpecificationDataStorage,
      SpecificationDisplay,
    ]),
  ],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
