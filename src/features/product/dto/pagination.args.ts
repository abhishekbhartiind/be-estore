import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('PaginationArgsInput')
export class PaginationArgs {
  @Field(() => Int)
  page: number

  @Field(() => Int)
  limit: number
}
