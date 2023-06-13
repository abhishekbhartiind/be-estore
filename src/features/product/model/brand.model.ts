import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { BaseEntity } from '@shared/models/base.model'

@ObjectType()
@InputType('ProductBrandInput')
@Entity()
export class ProductBrand extends BaseEntity {
  @Column()
  name: string

  @OneToMany(() => Product, (product) => product.brand)
  product?: Product
}
