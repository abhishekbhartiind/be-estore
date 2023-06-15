import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Product } from '@feature/product/model/product.model'
import { ProductService } from '@feature/product/product.service'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { Role } from '@feature/user/enum/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { UseGuards } from '@nestjs/common'
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
