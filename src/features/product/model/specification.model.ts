import { InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Product } from '@feature/product/product.model'
import { BaseEntity } from '@shared/models/base.model'
import { SpecificationDisplay } from '@feature/product/model/specification/display.model'
import { SpecificationConnectivity } from '@feature/product/model/specification/connectivity.model'
import { SpecificationCPU } from '@feature/product/model/specification/cpu.model'

@ObjectType()
@InputType('ProductSpecificationInput')
@Entity()
export class ProductSpecification extends BaseEntity {
  @Column()
  weight: number

  @ManyToOne(
    () => SpecificationConnectivity,
    (conn) => conn.productSpecification,
  )
  @JoinColumn()
  connectivity: SpecificationConnectivity

  @ManyToOne(() => SpecificationCPU, (cpu) => cpu.productSpecification)
  @JoinColumn()
  cpu: SpecificationCPU

  @ManyToOne(
    () => SpecificationDisplay,
    (display) => display.productSpecification,
  )
  @JoinColumn()
  display: SpecificationDisplay

  @OneToMany(() => Product, (product) => product.specification)
  product?: Product
}
