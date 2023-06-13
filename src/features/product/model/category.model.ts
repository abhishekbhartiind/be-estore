import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { BaseEntity } from '@shared/models/base.model'

@ObjectType()
@InputType('ProductCategoryInput')
@Entity()
export class ProductCategory extends BaseEntity {
  @Column()
  name: string

  @OneToMany(() => Product, (product) => product.category)
  product?: Product
}
