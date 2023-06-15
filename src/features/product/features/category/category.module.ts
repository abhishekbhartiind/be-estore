import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCategory } from '@feature/product/features/category/category.model'
import { CategoryService } from '@feature/product/features/category/category.service'
import { CategoryResolver } from '@feature/product/features/category/category.resolver'
import { CategoryAdminResolver } from '@feature/product/features/category/category.resolver.admin'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [CategoryService, CategoryResolver, CategoryAdminResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
