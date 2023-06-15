import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Specification } from '@feature/product/features/specification/model/specification.model'

@ObjectType()
@InputType('SpecificationConnectivityInput')
@Entity()
export class SpecificationConnectivity extends BaseEntity {
  @Column()
  mobileStandard?: string

  @Column('text', { array: true })
  connectivity?: string[]

  @Column()
  wifiStandard?: string

  @Column({ type: 'float' })
  bluetoothVersion?: number

  @Column()
  audio?: string

  @OneToMany(() => Specification, (specification) => specification.connectivity)
  productSpecification?: Specification
}