import { InputType } from '@nestjs/graphql'

@InputType()
export class ChangeEmailInput {
  email: string
  token: string
}
