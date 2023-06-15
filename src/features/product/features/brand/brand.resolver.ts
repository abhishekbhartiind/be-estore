import { Query, Resolver } from '@nestjs/graphql'
import { ProductBrand } from '@feature/product/features/brand/brand.model'
import { BrandService } from '@feature/product/features/brand/brand.service'

@Resolver(() => ProductBrand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}
  @Query(() => [ProductBrand])
  async brands(): Promise<ProductBrand[]> {
    return await this.brandService.fetch()
  }
}
