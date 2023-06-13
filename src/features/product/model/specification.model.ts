import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { BaseEntity } from '@shared/models/base.model'

@ObjectType()
@InputType('ProductSpecificationInput')
@Entity()
export class ProductSpecification extends BaseEntity {
  @Column()
  weight: number

  @OneToMany(() => Product, (product) => product.specification)
  product?: Product
}
