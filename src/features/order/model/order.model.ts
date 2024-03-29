import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from '@feature/user/user.model'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'
import { Address } from '@feature/address/model/address.model'

@ObjectType()
@InputType('OrderInput')
@Entity()
export class Order {
  @PrimaryColumn()
  id: number

  @Column()
  total: number

  @Column({ default: true })
  pending: boolean

  @Column({ type: 'timestamptz', nullable: true })
  cancelled?: Date | null

  @Column({ type: 'timestamptz', nullable: true })
  shipped?: Date | null

  @ManyToOne(() => Address, (address) => address.id, { eager: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order__billing_address',
  })
  billingAddress?: Address

  @Field(() => [OrderHasProduct])
  @OneToMany(
    () => OrderHasProduct,
    (orderHasProducts) => orderHasProducts.order,
  )
  products: OrderHasProduct[]

  @ManyToOne(() => Address, (address) => address.id, { eager: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order__shipping_address',
  })
  shippingAddress?: Address

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__order__user',
  })
  user?: User | null

  @CreateDateColumn()
  created?: Date

  @UpdateDateColumn({ nullable: true })
  updated?: Date

  @DeleteDateColumn({ nullable: true })
  deleted?: Date
}
