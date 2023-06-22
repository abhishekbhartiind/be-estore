import { InputType } from '@nestjs/graphql'
import { Address } from '@feature/address/model/address.model'

@InputType()
export class CreateAddressInput extends Address {}
