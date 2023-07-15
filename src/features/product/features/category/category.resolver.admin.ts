import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { HasRoles } from '@shared/decorator/role.decorator'
import { Role } from '@feature/user/enum/role.enum'
import {
  IDeleteResponse,
  IUpdateResponse,
} from '@shared/dto/typeorm-result.dto'
import { ProductCategory } from '@feature/product/features/category/category.model'
import { CategoryService } from '@feature/product/features/category/category.service'

@Resolver(() => ProductCategory)
export class CategoryAdminResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => ProductCategory)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createCategory(@Args('name') name: string): Promise<ProductCategory> {
    return this.categoryService.save(name)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateCategory(
    @Args('id') id: string,
    @Args('name') name: string,
  ): Promise<IUpdateResponse> {
    return this.categoryService.update(id, name)
  }

  @Mutation(() => IDeleteResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async deleteCategory(@Args('id') id: string): Promise<IDeleteResponse> {
    return await this.categoryService.delete(id)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreCategory(@Args('id') id: string): Promise<IUpdateResponse> {
    return await this.categoryService.restore(id)
  }
}
