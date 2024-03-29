import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateOrderInput {
  total: number
  products: AddProductToOrderInput[]
  shippingTo?: string
  billingTo?: string
}

@InputType()
class AddProductToOrderInput {
  @Field(() => Int)
  quantity: number

  @Field(() => String)
  productId: string
}
