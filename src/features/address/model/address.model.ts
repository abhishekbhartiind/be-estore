import { InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Country } from '@feature/address/enum/country-iso3166.enum'
import { AddressType } from '@feature/address/enum/address-type.enum'
import { User } from '@feature/user/user.model'

registerEnumType(AddressType, {
  name: 'AddressType',
})

registerEnumType(Country, {
  name: 'Country',
})

@ObjectType()
@InputType('AddressInput')
@Entity()
export class Address extends BaseEntity {
  @Column({ type: 'varchar', length: 7 })
  title?: string

  @Column({ type: 'varchar', length: 64 })
  firstName: string

  @Column({ type: 'varchar', length: 64 })
  lastName: string

  @Column({ nullable: true, type: 'varchar', length: 64 })
  companyName?: string

  @Column({ length: 255 })
  line1: string

  @Column({ length: 10 })
  zipCode: string

  @Column({ length: 55 })
  state: string

  @Column({ nullable: true, length: 16 })
  phone?: string

  /* ISO3166 format */
  @Column({
    type: 'enum',
    enum: Country,
    nullable: false,
  })
  countryCode: Country

  /* If true --> main shipping address */
  @Column({ default: false, type: 'boolean' })
  primary?: boolean

  /* Type of address (shipping vs billing) */
  @Column({
    type: 'enum',
    enum: AddressType,
    nullable: false,
  })
  type: AddressType

  @ManyToOne(() => User, (user: User) => user.address, { onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__address__user',
  })
  user: User
}
