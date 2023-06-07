import { Column, Entity } from 'typeorm'
import { BaseEntity } from '@shared/models/base.model'

@Entity()
export class Product extends BaseEntity {
  @Column({ nullable: true, length: 1600 })
  description?: string

  @Column({ type: 'float', nullable: true })
  discount?: number

  @Column()
  name: string

  @Column({ type: 'float', nullable: true })
  osUpgradable?: number

  @Column({ type: 'float' })
  price: number

  @Column({ type: 'varchar', length: 14 })
  sku: string

  @Column()
  stock: number

  @Column({ nullable: true })
  thumbnail?: string

  @Column({ default: 24 })
  warranty?: number
}
