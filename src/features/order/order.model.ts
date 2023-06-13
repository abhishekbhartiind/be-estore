import { Column, Entity } from 'typeorm'
import { InputType, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from '@shared/models/base.model'

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
}
