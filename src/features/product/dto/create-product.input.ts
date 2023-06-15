import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
  batteryId: string
  brandId: string
  categoryId: string
  connectivityId: string
  cpuId: string
  description?: string
  discount?: number
  displayId: string
  imageArray?: string[]
  name: string
  price: number
  @Field(() => Int)
  ram?: number
  @Field(() => Int)
  stock: number
  thumbnail?: string
}

/*
*
  @Field(() => Int)
  * */
