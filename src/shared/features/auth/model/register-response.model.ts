import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RegisterResponse {
  success: boolean
  message: string
}
