import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @CreateDateColumn()
  created?: Date

  @UpdateDateColumn({ nullable: true })
  updated?: Date

  @DeleteDateColumn({ nullable: true })
  deleted?: Date
}
