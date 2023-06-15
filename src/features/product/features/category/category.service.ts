import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Category } from '@feature/product/features/category/category.model'
import { categoryMock } from '@feature/product/features/category/category.mock'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Inserts data into `category` table from `category.mock.ts`
   * Only inserts data upon empty table
   */
  async insertCategories(): Promise<any> {
    try {
      const categories = await this.categoryRepo.find()
      if (categories.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values(categoryMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
