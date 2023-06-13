import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { ProductSpecification } from '@feature/product/model/specification.model'

@ObjectType()
@InputType('SpecificationDataStorageInput')
@Entity()
export class SpecificationDataStorage extends BaseEntity {
  @Field(() => Int)
  @Column()
  ram: number

  @Field(() => Int)
  @Column()
  storage: number

  @OneToMany(() => ProductSpecification, (specification) => specification.cpu)
  productSpecification?: ProductSpecification
}
