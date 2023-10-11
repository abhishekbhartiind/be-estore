import { BaseEntity } from '@shared/models/base.model'
import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'

@ObjectType()
@InputType('BlogPostInput')
@Entity()
export class BlogPost extends BaseEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  subTitle?: string

  @Column({ type: 'text' })
  content: string
}
