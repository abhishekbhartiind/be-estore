import { InputType, PartialType } from '@nestjs/graphql'
import { CreateProductInput } from '@feature/product/dto/create-product.input'

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}
