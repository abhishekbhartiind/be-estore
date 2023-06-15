import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { User } from '@feature/user/user.model'
import { BaseEntity } from '@shared/models/base.model'

@ObjectType()
@InputType('ProductRatingInput')
@Entity()
export class ProductRating extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'smallint' })
  star: number

  @Column({ type: 'text' })
  text: string

  @ManyToOne(() => Product, (product) => product.rating, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_rating_product',
  })
  product: Product

  @ManyToOne(() => User, (user) => user.rating, { cascade: true, eager: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_rating_user',
  })
  user: User
}
