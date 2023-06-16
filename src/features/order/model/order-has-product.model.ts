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
    foreignKeyConstraintName: 'FK_order-has-product_order',
  })
  order: Order

  @ManyToOne(() => Product, (product) => product.order)
  @JoinColumn({
    foreignKeyConstraintName: 'FK_order-has-product_product',
  })
  product: Product
}
