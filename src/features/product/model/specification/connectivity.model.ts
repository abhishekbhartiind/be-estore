import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { ProductSpecification } from '@feature/product/model/specification.model'

@ObjectType()
@InputType('SpecificationConnectivityInput')
@Entity()
export class SpecificationConnectivity extends BaseEntity {
  @Column()
  mobileStandard?: string

  @Column()
  connectivity?: string

  @Column()
  wifiStandard?: string

  @Column({ type: 'float' })
  bluetoothVersion?: number

  @Column()
  audio?: string

  @OneToMany(
    () => ProductSpecification,
    (specification) => specification.connectivity,
  )
  productSpecification?: ProductSpecification
}
