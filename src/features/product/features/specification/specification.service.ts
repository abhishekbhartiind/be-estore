import { ProductSpecification } from '@feature/product/features/specification/model/specification.model'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { SpecificationBattery } from '@feature/product/features/specification/model/battery.model'
import { SpecificationConnectivity } from '@feature/product/features/specification/model/connectivity.model'
import { SpecificationCPU } from '@feature/product/features/specification/model/cpu.model'
import { SpecificationDisplay } from '@feature/product/features/specification/model/display.model'
import { specificationMock } from '@feature/product/features/specification/mock/specification.mock'
import { displayMock } from '@feature/product/features/specification/mock/display.mock'
import { cpuMock } from '@feature/product/features/specification/mock/cpu.mock'
import { connectivityMock } from '@feature/product/features/specification/mock/connectivity.mock'
import { batteryMock } from '@feature/product/features/specification/mock/battery.mock'

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(ProductSpecification)
    private readonly specificationRepo: Repository<ProductSpecification>,
    @InjectRepository(SpecificationBattery)
    private readonly specBatteryRepo: Repository<SpecificationBattery>,
    @InjectRepository(SpecificationConnectivity)
    private readonly specConnRepo: Repository<SpecificationConnectivity>,
    @InjectRepository(SpecificationCPU)
    private readonly specCpuRepo: Repository<SpecificationCPU>,
    @InjectRepository(SpecificationDisplay)
    private readonly specDisplayRepo: Repository<SpecificationDisplay>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Inserts data into `product_specification` table from `mock/specification.mock.ts`
   * Only inserts data upon empty table
   */
  async mockSpecifications(): Promise<any> {
    try {
      const spec = await this.specificationRepo.find()
      if (spec.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductSpecification)
          .values(specificationMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `specification_battery` table from `mock/specification/battery.mock.ts`
   * Only inserts data upon empty table
   */
  async mockBatteries(): Promise<any> {
    try {
      const specBattery = await this.specBatteryRepo.find()
      if (specBattery.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(SpecificationBattery)
          .values(batteryMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `specification_connectivity` table from `mock/specification/connectivity.mock.ts`
   * Only inserts data upon empty table
   */
  async mockConnections(): Promise<any> {
    try {
      const specConnectivity = await this.specConnRepo.find()
      if (specConnectivity.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(SpecificationConnectivity)
          .values(connectivityMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `specification_cpu` table from `mock/specification/cpu.mock.ts`
   * Only inserts data upon empty table
   */
  async mockCpus(): Promise<any> {
    try {
      const specCpu = await this.specCpuRepo.find()
      if (specCpu.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(SpecificationCPU)
          .values(cpuMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `specification_display` table from `mock/specification/display.mock.ts`
   * Only inserts data upon empty table
   */
  async mockDisplays(): Promise<any> {
    try {
      const specDisplay = await this.specDisplayRepo.find()
      if (specDisplay.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(SpecificationDisplay)
          .values(displayMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
