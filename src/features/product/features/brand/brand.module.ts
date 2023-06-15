import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrandService } from '@feature/product/features/brand/brand.service'
import { ProductBrand } from '@feature/product/features/brand/brand.model'
import { BrandResolver } from '@feature/product/features/brand/brand.resolver'
import { BrandAdminResolver } from '@feature/product/features/brand/brand.resolver.admin'

@Module({
  imports: [TypeOrmModule.forFeature([ProductBrand])],
  providers: [BrandService, BrandResolver, BrandAdminResolver],
  exports: [BrandService],
})
export class BrandModule {}
