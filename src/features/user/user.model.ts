import { BaseEntity } from '@shared/models/base.model'
import { Column, Entity, OneToMany } from 'typeorm'
import {
  HideField,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { Role } from '@feature/user/enum/role.enum'
import { ProductRating } from '@feature/product/model/rating.model'

registerEnumType(Role, {
  name: 'Role',
})

@ObjectType()
@InputType('UserInput')
@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  avatar?: string

  @Column({ type: 'varchar', length: 55 })
  firstName: string

  @Column({ type: 'varchar', length: 55 })
  lastName: string

  @Column({ type: 'varchar', length: 512, unique: true })
  email: string

  @Column({ type: 'varchar', length: 55 })
  username?: string

  @Column({ type: 'varchar', length: 3 })
  title?: string

  @HideField()
  @Column({ type: 'varchar', length: 128 })
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
    nullable: true,
  })
  role?: Role

  @Column({ type: 'varchar', nullable: true, length: 16 })
  phone?: string

  @Column({ type: 'timestamptz', nullable: true })
  activated?: Date

  @Column({ type: 'text', unique: true, nullable: true })
  activationToken?: string | null

  @Column({ type: 'text', unique: true, nullable: true })
  passwordToken?: string | null

  @Column({ type: 'timestamptz', nullable: true })
  passwordTokenCreated?: Date | null

  @Column({ type: 'text', unique: true, nullable: true })
  emailToken?: string | null

  @Column({ type: 'timestamptz', nullable: true })
  emailTokenCreated?: Date | null

  @OneToMany(() => ProductRating, (rating) => rating.user)
  rating?: ProductRating[]
}
