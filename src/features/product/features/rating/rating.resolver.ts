import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProductRating } from '@feature/product/features/rating/rating.model'
import { RatingService } from '@feature/product/features/rating/rating.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { HasRoles } from '@shared/decorator/role.decorator'
import { Role } from '@feature/user/enum/role.enum'
import { CreateRatingInput } from '@feature/product/dto/create-rating.input'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { User } from '@feature/user/user.model'

@Resolver(() => ProductRating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Query(() => [ProductRating])
  async ratings(
    @Args('productId') productId: string,
  ): Promise<ProductRating[]> {
    return await this.ratingService.fetch({ product: { id: productId } })
  }

  @Mutation(() => ProductRating)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createRating(
    @Args('data') rating: CreateRatingInput,
    @CurrentUser() user: User,
  ): Promise<ProductRating> {
    return this.ratingService.save(rating, user.id as string)
  }
}
