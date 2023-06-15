import { Query, Resolver } from '@nestjs/graphql'
import { Category } from '@feature/product/features/category/category.model'
import { CategoryService } from '@feature/product/features/category/category.service'

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await this.categoryService.fetch()
  }
}
