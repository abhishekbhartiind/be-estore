import { InputType } from '@nestjs/graphql'

@InputType()
export class LoginUserInput {
  email: string
  password: string
}
