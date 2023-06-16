import { InputType, PartialType } from '@nestjs/graphql'
import { CreateAddressInput } from '@feature/address/dto/create-address.input'

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {}
