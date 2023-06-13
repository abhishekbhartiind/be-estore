import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from '@feature/order/order.model'
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
  @JoinColumn()
  order: Order

  @ManyToOne(() => Product, (product) => product.order)
  @JoinColumn()
  product: Product
}