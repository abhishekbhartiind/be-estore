import { Query, Resolver } from '@nestjs/graphql'
import { Product } from '@feature/product/product.model'

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => String)
  async query() {
    return 'mandatory query'
  }
}
