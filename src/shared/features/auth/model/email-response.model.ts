import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IEmailResponse {
  @Field(() => Boolean)
  success: boolean

  @Field(() => [String])
  rejected: any
}
