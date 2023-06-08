import { InputType, ObjectType } from '@nestjs/graphql'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Product } from '@feature/product/model/product.model'

@ObjectType()
@InputType('ProductImageInput')
@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column()
  url: string

  @ManyToOne(() => Product, (product) => product.image, { onDelete: 'CASCADE' })
  @JoinColumn()
  product?: Product

  @AfterLoad()
  formatUrl() {
    this.url = `http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}${this.url}`
  }
}
