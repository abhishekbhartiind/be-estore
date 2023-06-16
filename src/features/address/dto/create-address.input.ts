import { InputType } from '@nestjs/graphql'
import { Country } from '@feature/address/enum/country-iso3166.enum'
import { AddressType } from '@feature/address/enum/address-type.enum'
import { User } from '@feature/user/user.model'

@InputType()
export class CreateAddressInput {
  firstName: string
  lastName: string
  companyName?: string
  line1: string
  zipCode: string
  state: string
  phone?: string
  countryCode: Country
  primary: boolean
  type: AddressType
  user?: User
}
