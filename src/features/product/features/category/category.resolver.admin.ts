import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Brand } from '@feature/product/features/brand/brand.model'
import { BrandService } from '@feature/product/features/brand/brand.service'
import { Product } from '@feature/product/model/product.model'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { HasRoles } from '@shared/decorator/role.decorator'
import { Role } from '@feature/user/enum/role.enum'
import { CreateProductInput } from '@feature/product/dto/create-product.input'
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'
import { UpdateProductInput } from '@feature/product/dto/update-product.input'
import { Category } from '@feature/product/features/category/category.model'
import { CategoryService } from '@feature/product/features/category/category.service'

@Resolver(() => Category)
export class CategoryResolverAdmin {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createCategory(@Args('name') name: string): Promise<Category> {
    return this.categoryService.save(name)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateCategory(
    @Args('id') id: string,
    @Args('name') name: string,
  ): Promise<UpdateResult> {
    return this.categoryService.update(id, name)
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async removeCategory(@Args('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.delete(id)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreCategory(@Args('id') id: string): Promise<UpdateResult> {
    return await this.categoryService.restore(id)
  }
}
