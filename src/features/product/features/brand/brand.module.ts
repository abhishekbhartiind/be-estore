import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrandService } from '@feature/product/features/brand/brand.service'
import { Brand } from '@feature/product/features/brand/brand.model'

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
