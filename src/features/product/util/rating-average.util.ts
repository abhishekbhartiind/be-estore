import { PaginationArgs } from '@feature/product/dto/pagination.args'
import {
  Product,
  ProductsFetchResponse,
} from '@feature/product/model/product.model'
import { ProductRating } from '@feature/product/features/rating/rating.model'
import { FilterArgs } from '@feature/product/dto/filter.args'

export const withRating = (product: Product): Product => {
  let ratingTotal = 0
  const ratingCount = Array.isArray(product.rating) && product.rating.length

  product?.rating?.map((rating: ProductRating) => {
    ratingTotal = rating.star + ratingTotal
  })
  product.ratingAverage = ratingTotal / Number(ratingCount)

  return product
}

export const withRatingArray = (
  products: Product[],
  paginationArgs: PaginationArgs,
  count: number,
  filter?: FilterArgs,
): ProductsFetchResponse => {
  const { page, limit } = paginationArgs
  products.map((product: Product, i: number) => {
    if (product.rating && product.rating?.length > 0) {
      const ratingCount =
        Array.isArray(products[i].rating) && products[i]?.rating?.length
      let ratingTotal = 0
      products[i]?.rating?.map((rating: ProductRating) => {
        ratingTotal = rating.star + ratingTotal
      })
      products[i].ratingAverage = ratingTotal / Number(ratingCount)
    }
  })
  return {
    data: products,
    page,
    limit,
    count,
    ...(filter && filter),
  }
}
