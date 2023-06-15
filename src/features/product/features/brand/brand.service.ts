import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { brandMock } from '@feature/product/features/brand/brand.mock'
import { Brand } from '@feature/product/features/brand/brand.model'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Fetches all brand records
   */
  async fetch(): Promise<any> {
    try {
      return this.brandRepo.find()
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `brand` table from `brand.mock.ts`
   * Only inserts data upon empty table
   */
  async mockBrands(): Promise<any> {
    try {
      const brands = await this.brandRepo.find()
      if (brands.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Brand)
          .values(brandMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
