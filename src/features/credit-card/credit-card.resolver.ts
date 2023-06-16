import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import { DeleteResult } from '@shared/dto/typeorm-result.dto'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { Role } from '@feature/user/enum/role.enum'
import { User } from '@feature/user/user.model'
import { CreditCard } from '@feature/credit-card/credit-card.model'
import { CreditCardService } from '@feature/credit-card/credit-card.service'
import { CreateCreditCardInput } from '@feature/credit-card/dto/create-credit-card.input'

@Resolver(() => CreditCard)
export class CreditCardResolver {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Query(() => [CreditCard])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async creditCards(@CurrentUser() user: User): Promise<CreditCard[]> {
    return await this.creditCardService.fetch({
      user: { id: user.id },
    })
  }

  @Mutation(() => CreditCard)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createCreditCard(
    @CurrentUser() user: User,
    @Args('data') creditCard: CreateCreditCardInput,
  ): Promise<CreditCard> {
    return await this.creditCardService.save(creditCard, user.id as string)
  }

  /*@Mutation(() => UpdateResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async swapPrimaryCard(
    @CurrentUser() user: User,
    @Args('cardId') cardId: string,
  ): Promise<UpdateResult> {
    return await this.creditCardService.swapMainCard(
      cardId,
      user.id as string,
    )
  }*/

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async deleteCreditCard(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DeleteResult> {
    return await this.creditCardService.delete(id)
  }
}
