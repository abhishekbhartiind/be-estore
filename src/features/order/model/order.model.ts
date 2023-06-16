import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from '@shared/models/base.model'
import { User } from '@feature/user/user.model'
import { OrderHasProduct } from '@feature/order/model/order-has-product.model'
import { Address } from '@feature/address/model/address.model'

@ObjectType()
@InputType('OrderInput')
@Entity()
export class Order extends BaseEntity {
  @Column()
  total: number

  @Column({ default: true })
  pending: boolean

  @Column({ type: 'timestamptz', nullable: true })
  cancelled?: Date | null

  @ManyToOne(() => Address, (address) => address.id, { eager: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_order_address_billing',
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
    foreignKeyConstraintName: 'FK_order_address_shipping',
  })
  shippingAddress?: Address

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_order_user',
  })
  user?: User | null
}
