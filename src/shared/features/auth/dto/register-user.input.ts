import { Field, InputType } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'

@InputType()
export class RegisterUserInput extends User {
  @Field(() => String)
  password: string
}
