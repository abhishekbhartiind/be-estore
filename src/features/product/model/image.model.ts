import { InputType, ObjectType } from '@nestjs/graphql'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Product } from '@feature/product/product.model'

@ObjectType()
@InputType('ProductImageInput')
@Entity()
export class ProductImage extends BaseEntity {
  @Column()
  url: string

  @ManyToOne(() => Product, (product) => product.image, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_image_product',
  })
  product?: Product

  @AfterLoad()
  formatUrl() {
    this.url = `http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}${this.url}`
  }
}
