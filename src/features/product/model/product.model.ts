import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { FetchResponse } from '@feature/product/dto/fetch-response.entity'
import { ProductRating } from '@feature/product/features/rating/rating.model'
import { ProductImage } from '@feature/product/model/image.model'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'
import { ProductBrand } from '@feature/product/features/brand/brand.model'
import { ProductCategory } from '@feature/product/features/category/category.model'
import { ProductSpecification } from '@feature/product/model/specification.model'

@ObjectType()
@InputType('ProductInput')
@Entity()
export class Product extends BaseEntity {
  @Column({ nullable: true, length: 1600 })
  description?: string

  @Column({ type: 'float', nullable: true })
  discount?: number

  @Column()
  name: string

  @Column({ nullable: true })
  osUpgradable?: string

  @Column({ type: 'float' })
  price: number

  ratingAverage?: number

  @Column({ type: 'varchar', length: 32 })
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
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__brand',
  })
  brand: ProductBrand

  @ManyToOne(() => ProductCategory, (category) => category.product, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__category',
  })
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
    {
      cascade: true,
    },
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK__product__specification',
  })
  specification: ProductSpecification
}

@ObjectType()
@InputType('ProductsFetchResponseInput')
export class ProductsFetchResponse extends FetchResponse(Product) {}

@ObjectType()
export class GroupedRamResponse {
  label: string
  @Field(() => Int)
  value: number
}

@ObjectType()
export class GroupedStorageResponse {
  label: string
  @Field(() => Int)
  value: number
}

@ObjectType()
export class GroupedBrandResponse {
  label: string
}
