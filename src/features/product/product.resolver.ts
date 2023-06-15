import { Args, Query, Resolver } from '@nestjs/graphql'
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

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

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
}
