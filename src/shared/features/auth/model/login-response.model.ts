import { ObjectType } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'

@ObjectType()
export class LoginResponse {
  user: User
  accessToken: string
}
