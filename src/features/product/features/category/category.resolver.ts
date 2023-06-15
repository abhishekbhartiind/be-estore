import { Query, Resolver } from '@nestjs/graphql'
import { ProductCategory } from '@feature/product/features/category/category.model'
import { CategoryService } from '@feature/product/features/category/category.service'

@Resolver(() => ProductCategory)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => [ProductCategory])
  async categories(): Promise<ProductCategory[]> {
    return await this.categoryService.fetch()
  }
}
