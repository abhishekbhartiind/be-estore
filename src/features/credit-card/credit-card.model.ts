import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '@feature/user/user.model'
import { BaseEntity } from '@shared/models/base.model'
import { Transform } from 'class-transformer'
import { formatExpirationDate } from '@feature/credit-card/util/expiration-date.util'

@ObjectType()
@InputType('CreditCardInput')
@Entity()
export class CreditCard extends BaseEntity {
  @Column({ type: 'varchar', length: 16 })
  creditCardNumber: string

  @Column({ type: 'timestamptz' })
  expirationDate: Date

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Transform(({ obj }) => formatExpirationDate(obj.expirationDate))
  expirationDateFormatted?: string

  @Field(() => Int)
  @Column({ type: 'int' })
  ccv: number

  @Column()
  cardType: string

  @Column({ default: false, type: 'boolean' })
  main?: boolean

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  @JoinColumn({
    foreignKeyConstraintName: 'FK__credit_card__user',
  })
  user?: User
}
