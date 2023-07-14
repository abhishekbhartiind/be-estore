import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IRegisterResponse {
  success: boolean
}
