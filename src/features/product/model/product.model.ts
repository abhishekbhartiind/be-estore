import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { FetchResponse } from '@feature/product/dto/fetch-response.entity'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductImage } from '@feature/product/model/image.model'
import { ProductCategory } from '@feature/product/model/category.model'
import { ProductBrand } from '@feature/product/model/brand.model'
import { ProductSpecification } from '@feature/product/model/specification.model'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'

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

  @ManyToOne(() => ProductBrand, (brand) => brand.product, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  brand: ProductBrand

  @ManyToOne(() => ProductCategory, (category) => category.product, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  category: ProductCategory

  @OneToMany(() => ProductImage, (image) => image.product, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  image?: ProductImage[]

  @OneToMany(
    () => OrderHasProduct,
    (orderHasProduct) => orderHasProduct.product,
  )
  order?: OrderHasProduct[]

  @OneToMany(() => ProductRating, (rating) => rating.product)
  rating?: ProductRating[]

  @ManyToOne(
    () => ProductSpecification,
    (specification) => specification.product,
    { cascade: true },
  )
  @JoinColumn()
  specification: ProductSpecification
}

@ObjectType()
@InputType('ProductsFetchResponseInput')
export class ProductsFetchResponse extends FetchResponse(Product) {}
