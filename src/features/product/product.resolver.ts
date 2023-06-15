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
import { Brand } from '@feature/product/features/brand/brand.model'
import { Category } from '@feature/product/features/category/category.model'
import { BrandService } from '@feature/product/features/brand/brand.service'
import { CategoryService } from '@feature/product/features/category/category.service'

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => ProductsFetchResponse)
  async products(
    @Args('paginationArgs', { nullable: true }) paginationArgs?: PaginationArgs,
    @Args('sortArgs', { nullable: true }) sortArgs?: SortArgs,
    @Args('filterArgs', { nullable: true }) filterArgs?: FilterArgs,
  ): Promise<ProductsFetchResponse> {
    return await this.productService.fetch(
      paginationArgs ? paginationArgs : { page: 1, limit: 10 },
      sortArgs
        ? sortArgs
        : { sortBy: SORT_OPTION.PRICE, sortDir: SORT_DIR.DESC },
      filterArgs,
    )
  }
  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.fetchOne(id)
  }

  @Query(() => [ProductRating])
  async ratings(): Promise<ProductRating[]> {
    return await this.productService.fetchRatings()
  }

  @Mutation(() => ProductRating)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createRating(
    @Args('data') rating: CreateRatingInput,
    @CurrentUser() user: User,
  ): Promise<ProductRating> {
    return this.productService.saveRating(rating, user.id as string)
  }
}
