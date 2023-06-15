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

@Resolver(() => Brand)
export class BrandAdminResolver {
  constructor(private readonly brandService: BrandService) {}

  @Mutation(() => Brand)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async createBrand(@Args('name') name: string): Promise<Brand> {
    return this.brandService.save(name)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async updateBrand(
    @Args('id') id: string,
    @Args('name') name: string,
  ): Promise<UpdateResult> {
    return this.brandService.update(id, name)
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async removeBrand(@Args('id') id: string): Promise<DeleteResult> {
    return await this.brandService.delete(id)
  }

  @Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.ADMIN)
  async restoreBrand(@Args('id') id: string): Promise<UpdateResult> {
    return await this.brandService.restore(id)
  }
}
