import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EmailResponse {
  @Field(() => Boolean)
  success: boolean

  @Field(() => [String])
  rejected: any
}
