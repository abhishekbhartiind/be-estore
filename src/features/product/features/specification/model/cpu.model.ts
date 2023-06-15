import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { ProductSpecification } from '@feature/product/features/specification/model/specification.model'

@ObjectType()
@InputType('SpecificationCPUInput')
@Entity()
export class SpecificationCPU extends BaseEntity {
  @Field(() => [Int])
  @Column()
  cores?: number

  @Column('float', { array: true })
  frequency?: number[]

  @Column()
  name: string

  @OneToMany(() => ProductSpecification, (specification) => specification.cpu)
  productSpecification?: ProductSpecification
}
