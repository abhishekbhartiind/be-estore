/**
 * This entity could be skipped to implement since TypeORM's "ManyToMany" creates a join table automatically.
 * Since information is required, on how many times a product was ordered in one single order,
 * this entity is implemented with the custom column "quantity".
 */
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from '@feature/order/model/order.model'
import { Product } from '@feature/product/model/product.model'

@ObjectType()
@InputType('OrderHasProductInput')
@Entity()
export class OrderHasProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => Int)
  @Column()
  quantity: number

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order_has_product__order',
  })
  order: Order

  @ManyToOne(() => Product, (product) => product.order)
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order_has_product__product',
  })
  product: Product
}
