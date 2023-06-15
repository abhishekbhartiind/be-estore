import { Query, Resolver } from '@nestjs/graphql'
import { Brand } from '@feature/product/features/brand/brand.model'
import { BrandService } from '@feature/product/features/brand/brand.service'

@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}
  @Query(() => [Brand])
  async brands(): Promise<Brand[]> {
    return await this.brandService.fetch()
  }
}
