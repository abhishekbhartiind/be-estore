import { Resolver } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'

@Resolver(() => User)
export class UserResolver {}
