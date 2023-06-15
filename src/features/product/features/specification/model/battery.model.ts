import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Specification } from '@feature/product/features/specification/model/specification.model'

@ObjectType()
@InputType('SpecificationBatteryInput')
@Entity()
export class SpecificationBattery extends BaseEntity {
  @Field(() => Int)
  @Column()
  capacity: number

  @Field(() => Int)
  @Column()
  chargingSpeed?: number

  @Column({ type: 'float' })
  reverseCharging?: number

  @Column({ type: 'varchar', length: 12 })
  type: string

  @Field(() => Int)
  @Column()
  wirelessCharging?: number

  @OneToMany(() => Specification, (specification) => specification.battery)
  productSpecification?: Specification
}