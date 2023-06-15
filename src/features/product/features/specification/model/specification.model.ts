import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Product } from '@feature/product/model/product.model'
import { BaseEntity } from '@shared/models/base.model'
import { SpecificationBattery } from '@feature/product/features/specification/model/battery.model'
import { SpecificationConnectivity } from '@feature/product/features/specification/model/connectivity.model'
import { SpecificationCPU } from '@feature/product/features/specification/model/cpu.model'
import { SpecificationDisplay } from '@feature/product/features/specification/model/display.model'

@ObjectType()
@InputType('SpecificationInput')
@Entity()
export class Specification extends BaseEntity {
  @Field(() => Int)
  @Column()
  dataRam: number

  @Field(() => [Int])
  @Column('int', { array: true })
  dataStorage: number[]

  @Column({ type: 'float' })
  dimensionLength: number

  @Column({ type: 'float' })
  dimensionWidth: number

  @Column({ type: 'float' })
  dimensionDepth: number

  @Column({ type: 'varchar', length: 2, default: 'mm' })
  dimensionUnit?: string

  @Column()
  dimensionWeight: number

  @ManyToOne(
    () => SpecificationBattery,
    (battery) => battery.productSpecification,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_specification_battery',
  })
  battery: SpecificationBattery

  @ManyToOne(
    () => SpecificationConnectivity,
    (conn) => conn.productSpecification,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_specification_connectivity',
  })
  connectivity: SpecificationConnectivity

  @ManyToOne(() => SpecificationCPU, (cpu) => cpu.productSpecification)
  @JoinColumn({
    foreignKeyConstraintName: 'FK_specification_cpu',
  })
  cpu: SpecificationCPU

  @ManyToOne(
    () => SpecificationDisplay,
    (display) => display.productSpecification,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_specification_display',
  })
  display: SpecificationDisplay

  @OneToMany(() => Product, (product) => product.specification)
  product?: Product
}
