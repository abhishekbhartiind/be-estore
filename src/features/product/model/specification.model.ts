import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { BaseEntity } from '@shared/models/base.model'
import { SpecificationDisplay } from '@feature/product/model/specification/display.model'

@ObjectType()
@InputType('ProductSpecificationInput')
@Entity()
export class ProductSpecification extends BaseEntity {
  @Column()
  weight: number

  @ManyToOne(
    () => SpecificationDisplay,
    (display) => display.productSpecification,
  )
  @JoinColumn()
  display: SpecificationDisplay

  @OneToMany(() => Product, (product) => product.specification)
  product?: Product
}
