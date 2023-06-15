import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { Product } from '@feature/product/model/product.model'
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
import { ProductImage } from '@feature/product/model/image.model'
import { productMock } from '@feature/product/mock/product.mock'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import { DeleteResult, UpdateResult } from '@shared/dto/typeorm-result.dto'
import { UpdateProductInput } from '@feature/product/dto/update-product.input'
import { CreateProductInput } from '@feature/product/dto/create-product.input'
import { PRODUCT_RELATIONS } from '@feature/product/constant/entity-relation.constant'
import { BrandService } from '@feature/product/features/brand/brand.service'
import { CategoryService } from '@feature/product/features/category/category.service'
import { SpecificationService } from '@feature/product/features/specification/specification.service'
import { RatingService } from '@feature/product/features/rating/rating.service'

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private ratingService: RatingService,
    private specificationService: SpecificationService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.brandService.mockBrands()
    await this.categoryService.mockCategories()
    await this.specificationService.mockBatteries()
    await this.specificationService.mockConnections()
    await this.specificationService.mockCpus()
    await this.specificationService.mockDisplays()
    await this.specificationService.mockSpecifications()
    await this.mockProducts()
    await this.ratingService.mockRatings()
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
      const {
        batteryId,
        brandId,
        categoryId,
        connectivityId,
        cpuId,
        displayId,
        imageArray,
        ...rest
      } = _product

      const product = await this.productRepo.save({
        ...(brandId && { brand: { id: brandId } }),
        ...(categoryId && { category: { id: categoryId } }),
        ...((batteryId || connectivityId || cpuId || displayId) && {
          specification: {
            ...(batteryId && { battery: { id: batteryId } }),
            ...(connectivityId && { connectivity: { id: connectivityId } }),
            ...(cpuId && { cpu: { id: cpuId } }),
            ...(displayId && { display: { id: displayId } }),
          },
        }),
        ...rest,
      })

      if (imageArray && Array.isArray(imageArray)) {
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

      const {
        batteryId,
        brandId,
        categoryId,
        connectivityId,
        cpuId,
        displayId,
        imageArray,
        ...rest
      } = product

      if (Array.isArray(imageArray)) {
        imageArray.map(async (url) => {
          await this.imageRepo.save({ url, product: { id } })
        })
      }

      return await this.productRepo.update(
        { id },
        {
          ...(brandId && { brand: { id: brandId } }),
          ...(categoryId && { category: { id: categoryId } }),
          ...((batteryId || connectivityId || cpuId || displayId) && {
            specification: {
              ...(batteryId && { battery: { id: batteryId } }),
              ...(connectivityId && { connectivity: { id: connectivityId } }),
              ...(cpuId && { cpu: { id: cpuId } }),
              ...(displayId && { display: { id: displayId } }),
            },
          }),
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
   * Inserts data into `product` table from `product.mock.ts`
   * Only inserts data upon empty table
   */
  async mockProducts(): Promise<any> {
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
}
