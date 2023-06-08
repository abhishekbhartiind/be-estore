import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { FetchResponse } from '@feature/product/dto/fetch-response.entity'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductImage } from '@feature/product/model/image.model'

@ObjectType()
@InputType('ProductInput')
@Entity('products')
export class Product extends BaseEntity {
  @Column({ nullable: true, length: 1600 })
  description?: string

  @Column({ type: 'float', nullable: true })
  discount?: number

  @Column()
  name: string

  @Column({ type: 'float', nullable: true })
  osUpgradable?: number

  @Column({ type: 'float' })
  price: number

  ratingAverage?: number

  @Column({ type: 'varchar', length: 14 })
  sku: string

  @Column()
  @Field(() => Int)
  stock: number

  @Column({ nullable: true })
  thumbnail?: string

  @Column({ default: 24 })
  @Field(() => Int)
  warranty?: number

  @OneToMany(() => ProductImage, (image) => image.product, {
    eager: true,
    cascade: true,
  })
  image?: ProductImage[]

  @OneToMany(() => ProductRating, (rating) => rating.product)
  rating?: ProductRating[]
}

@ObjectType()
@InputType('ProductsFetchResponseInput')
export class ProductsFetchResponse extends FetchResponse(Product) {}
