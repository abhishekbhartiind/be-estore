import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
  name: string
  description?: string
  thumbnail?: string
  price: number
  discount?: number
  specificationId: string
  brandId: string
  categoryId: string
  imageArray: string[]
  @Field(() => Int)
  stock: number
  @Field(() => Int)
  ram?: number
}
