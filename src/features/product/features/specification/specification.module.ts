import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductSpecification } from '@feature/product/features/specification/model/specification.model'
import { SpecificationBattery } from '@feature/product/features/specification/model/battery.model'
import { SpecificationConnectivity } from '@feature/product/features/specification/model/connectivity.model'
import { SpecificationCPU } from '@feature/product/features/specification/model/cpu.model'
import { SpecificationDisplay } from '@feature/product/features/specification/model/display.model'
import { SpecificationService } from '@feature/product/features/specification/specification.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductSpecification,
      SpecificationBattery,
      SpecificationConnectivity,
      SpecificationCPU,
      SpecificationDisplay,
    ]),
  ],
  providers: [SpecificationService],
  exports: [SpecificationService],
})
export class SpecificationModule {}
