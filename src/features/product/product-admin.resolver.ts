import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  Product,
  ProductsFetchResponse,
} from '@feature/product/model/product.model'
import { PaginationArgs } from '@feature/product/dto/pagination.args'
import { SortArgs } from '@feature/product/dto/sort.args'
import { FilterArgs } from '@feature/product/dto/filter.args'
import { ProductService } from '@feature/product/product.service'
import {
  SORT_DIR,
  SORT_OPTION,
} from '@feature/product/constant/sort-options.constant'
import { ProductRating } from '@feature/product/model/rating.model'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { Role } from '@feature/user/enum/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { UseGuards } from '@nestjs/common'
import { CreateRatingInput } from '@feature/product/dto/create-rating.input'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { User } from '@feature/user/user.model'
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'
import { UpdateProductInput } from '@feature/product/dto/update-product.input'
import { CreateProductInput } from '@feature/product/dto/create-product.input'

@Resolver(() => Product)
export class ProductAdminResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createProduct(
    @Args('data') product: CreateProductInput,
  ): Promise<Product> {
    return this.productService.save(product)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateProduct(
    @Args('id') id: string,
    @Args('data') product: UpdateProductInput,
  ): Promise<UpdateResult> {
    return this.productService.update(id, product)
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async removeProduct(@Args('id') id: string): Promise<DeleteResult> {
    return await this.productService.delete(id)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreProduct(@Args('id') id: string): Promise<UpdateResult> {
    return await this.productService.restore(id)
  }
}
