import { InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
  password: string
  token: string
}
