import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { Product } from '@feature/product/product.model'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaginationArgs } from '@feature/product/dto/pagination.args'
import { FilterArgs } from '@feature/product/dto/filter.args'
import { SortArgs } from '@feature/product/dto/sort.args'
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
} from '@feature/product/constant/filter.constant'
import {
  SORT_DIR,
  SORT_OPTION,
} from '@feature/product/constant/sort-options.constant'
import {
  withRating,
  withRatingArray,
} from '@feature/product/util/rating-average.util'
import { ProductRating } from '@feature/product/model/rating.model'
import { ProductImage } from '@feature/product/model/image.model'
import { ratingMock } from '@feature/product/mock/rating.mock'
import { productMock } from '@feature/product/mock/product.mock'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'
import { UpdateProductInput } from '@feature/product/dto/update-product.input'
import { CreateProductInput } from '@feature/product/dto/create-product.input'
import {
  PRODUCT_RELATIONS,
  RATING_RELATIONS,
} from '@feature/product/constant/entity-relation.constant'
import { CreateRatingInput } from '@feature/product/dto/create-rating.input'
import { ProductCategory } from '@feature/product/model/category.model'
import { categoryMock } from '@feature/product/mock/category.mock'
import { ProductBrand } from '@feature/product/model/brand.model'
import { brandMock } from '@feature/product/mock/brand.mock'
import { ProductSpecification } from '@feature/product/model/specification.model'
import { specificationMock } from '@feature/product/mock/specification.mock'
import { SpecificationBattery } from '@feature/product/model/specification/battery.model'
import { SpecificationConnectivity } from '@feature/product/model/specification/connectivity.model'
import { SpecificationCPU } from '@feature/product/model/specification/cpu.model'
import { SpecificationDisplay } from '@feature/product/model/specification/display.model'
import { batteryMock } from '@feature/product/mock/specification/battery.mock'
import { connectivityMock } from '@feature/product/mock/specification/connectivity.mock'
import { cpuMock } from '@feature/product/mock/specification/cpu.mock'
import { displayMock } from '@feature/product/mock/specification/display.mock'

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductBrand)
    private readonly brandRepo: Repository<ProductBrand>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
    @InjectRepository(ProductRating)
    private readonly ratingRepo: Repository<ProductRating>,
    @InjectRepository(ProductSpecification)
    private readonly specRepo: Repository<ProductSpecification>,
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

  async onModuleInit(): Promise<void> {
    await this.insertBrands()
    await this.insertCategories()
    await this.insertSpecificationBatteries()
    await this.insertSpecificationConnectivity()
    await this.insertSpecificationCpu()
    await this.insertSpecificationDisplay()
    await this.insertSpecification()
    await this.insertProducts()
    await this.insertRatings()
  }

  /**
   * Fetches all records
   * @param filter
   * @param pagination
   * @param sort
   */
  async fetch(pagination: PaginationArgs, sort: SortArgs, filter?: FilterArgs) {
    try {
      const { page } = pagination
      const offset = (pagination.page - 1) * pagination.limit
      const limit = pagination.limit ? pagination.limit : 10

      if (!sort?.sortDir) sort.sortDir = SORT_DIR.DESC
      if (!sort?.sortBy) sort.sortBy = SORT_OPTION.PRICE
      const { sortBy, sortDir } = sort

      // base query
      const query = await this.productRepo.createQueryBuilder('product')
      // relationships
      query.innerJoinAndSelect('product.brand', 'brand')
      query.innerJoinAndSelect('product.category', 'category')
      query.leftJoinAndSelect('product.image', 'image')
      query.leftJoinAndSelect('product.rating', 'rating')
      query.leftJoinAndSelect('product.specification', 'specification')
      query.leftJoinAndSelect('specification.battery', 'battery')
      query.leftJoinAndSelect('specification.connectivity', 'connectivity')
      query.leftJoinAndSelect('specification.cpu', 'cpu')
      query.leftJoinAndSelect('specification.display', 'display')

      // search
      if (filter?.search)
        query.andWhere(
          '(product.name LIKE :search OR product.description LIKE :search OR cpu.name LIKE :search)',
          {
            search: `%${filter.search}%`,
          },
        )

      // filter
      if (filter?.brand)
        query.andWhere(filter.brand && 'brand.name IN (:...brand)', {
          brand: filter.brand,
        })
      if (filter?.category)
        query.andWhere(filter.category && 'category.name IN (:...category)', {
          category: filter.category,
        })
      if (filter?.ram)
        query.andWhere(filter.ram && 'ram.capacityGB IN (:...ram)', {
          ram: filter.ram,
        })
      if (filter?.storage)
        query.andWhere(
          filter.storage && 'storage.capacityGB IN (:...storage)',
          { storage: filter.storage },
        )
      if (filter?.priceMin)
        query.andWhere(
          `\`p\`.\`price\` BETWEEN ${Number(
            filter.priceMin ? filter.priceMin : DEFAULT_MIN_PRICE,
          )} AND ${Number(
            filter.priceMax ? filter.priceMax : DEFAULT_MAX_PRICE,
          )}`,
        )

      // pagination
      query.skip(offset)
      query.take(limit)

      // sort
      query.orderBy(
        sortBy !== SORT_OPTION.RATING ? `product.${sortBy}` : 'rating.star',
        sortDir,
      )

      const [products, count] = await Promise.all([
        query.getMany(),
        query.getCount(),
      ])

      // calculate average rating and add to each product into property ratingAverage
      return (
        products &&
        withRatingArray(
          products,
          {
            page,
            limit,
          },
          count,
          filter,
        )
      )
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetch record by identifier
   * @param id Record identifier to be fetched
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetchOne(id: string, where?: object): Promise<Product> {
    try {
      let product
      if (id)
        product = await this.productRepo.findOne({
          where: { id },
          relations: PRODUCT_RELATIONS,
        })
      if (where)
        product = await this.productRepo.findOne({
          where: where,
          relations: PRODUCT_RELATIONS,
        })
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      // calculate average rating and add to product.ratingAverage
      if (product.rating && product.rating?.length > 0) {
        return withRating(product)
      }

      return product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param _product DTO
   */
  async save(_product: CreateProductInput): Promise<Product> {
    try {
      const { imageArray, ...rest } = _product

      const product = await this.productRepo.save({
        ...rest,
      })

      if (Array.isArray(imageArray)) {
        imageArray.map(async (url) => {
          await this.imageRepo.save({ url, product })
        })
        await this.productRepo.update({ id: product.id }, product)
      }

      return (await this.productRepo.findOne({
        where: { id: product.id },
        relations: PRODUCT_RELATIONS,
      })) as Product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param product DTO
   */
  async update(id: string, product: UpdateProductInput): Promise<UpdateResult> {
    try {
      const foundProduct = await this.productRepo.findOne({
        where: { id },
        relations: PRODUCT_RELATIONS,
      })
      if (!foundProduct)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      const { imageArray, ...rest } = product

      if (Array.isArray(imageArray)) {
        imageArray.map(async (url) => {
          await this.imageRepo.save({ url, product: { id } })
        })
      }

      return await this.productRepo.update(
        { id },
        {
          ...rest,
        },
      )
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Deletes a record by identifier
   * @param id Record identifier
   */
  async delete(id: string): Promise<DeleteResult> {
    try {
      const product = await this.productRepo.findOne({ where: { id } })
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return await this.productRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Restores a record by identifier
   * @param id Record identifier to be restored
   */
  async restore(id: string): Promise<UpdateResult> {
    try {
      const product = await this.productRepo.restore(id)
      if (!product)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return product
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetches all rating records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetchRatings(where?: object): Promise<ProductRating[]> {
    try {
      return await this.ratingRepo.find({
        ...(where && { where }),
        relations: RATING_RELATIONS,
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a rating record
   * @param ratingInput DTO
   * @param userId Owner of record
   */
  async saveRating(
    ratingInput: CreateRatingInput,
    userId: string,
  ): Promise<ProductRating> {
    try {
      const { productId, ...rest } = ratingInput

      const rating = await this.ratingRepo.save({
        ...rest,
        user: { id: userId },
        product: { id: productId },
      })

      return (await this.ratingRepo.findOne({
        where: { id: rating.id },
        relations: RATING_RELATIONS,
      })) as ProductRating
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `brand` table from `brand.mock.ts`
   * Only inserts data upon empty table
   */
  async insertBrands(): Promise<any> {
    try {
      const brands = await this.brandRepo.find()
      if (brands.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductBrand)
          .values(brandMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

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
          .into(ProductCategory)
          .values(categoryMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `product` table from `product.mock.ts`
   * Only inserts data upon empty table
   */
  async insertProducts(): Promise<any> {
    try {
      const products = await this.productRepo.find()
      if (products.length === 0) {
        // insert products
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(productMock)
          .execute()
        // insert images
        productMock.map((product) => {
          const { id, imageArray } = product

          if (Array.isArray(imageArray)) {
            imageArray.map(async (url) => {
              await this.imageRepo.save({ url, product: { id } })
            })
          }
        })
        return true
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `rating` table from `rating.mock.ts`
   * Only inserts data upon empty table
   */
  async insertRatings(): Promise<any> {
    try {
      const ratings = await this.ratingRepo.find()
      if (ratings.length <= 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ProductRating)
          .values(ratingMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into `product_specification` table from `mock/specification.mock.ts`
   * Only inserts data upon empty table
   */
  async insertSpecification(): Promise<any> {
    try {
      const spec = await this.specRepo.find()
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
  async insertSpecificationBatteries(): Promise<any> {
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
  async insertSpecificationConnectivity(): Promise<any> {
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
  async insertSpecificationCpu(): Promise<any> {
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
  async insertSpecificationDisplay(): Promise<any> {
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
