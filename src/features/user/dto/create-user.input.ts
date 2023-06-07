import { InputType } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'

@InputType()
export class CreateUserInput extends User {}
