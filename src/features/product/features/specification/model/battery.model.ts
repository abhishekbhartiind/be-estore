import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { ProductSpecification } from '@feature/product/features/specification/model/specification.model'

@ObjectType()
@InputType('SpecificationBatteryInput')
@Entity()
export class SpecificationBattery extends BaseEntity {
  @Field(() => Int)
  @Column()
  capacity: number

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  chargingSpeed?: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  reverseCharging?: number

  @Column({ type: 'varchar', length: 12 })
  type: string

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  wirelessCharging?: number

  @OneToMany(
    () => ProductSpecification,
    (specification) => specification.battery,
  )
  productSpecification?: ProductSpecification
}
