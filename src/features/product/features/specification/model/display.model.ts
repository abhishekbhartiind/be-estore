import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Specification } from '@feature/product/features/specification/model/specification.model'

@ObjectType()
@InputType('SpecificationDisplayInput')
@Entity()
export class SpecificationDisplay extends BaseEntity {
  @Column()
  aspectRatio?: string

  @Field(() => Int)
  @Column()
  pixelDensity?: number

  @Field(() => Int)
  @Column()
  refreshRate?: number

  @Column()
  resolution?: string

  @Column({ type: 'numeric', precision: 3, scale: 1 })
  screenToBody?: number

  @Column({ type: 'numeric', precision: 3, scale: 1 })
  size: number

  @OneToMany(() => Specification, (specification) => specification.display)
  productSpecification?: Specification
}