import { Field, InputType } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'

@InputType()
export class RegisterInput extends User {
  @Field(() => String)
  password: string
}
