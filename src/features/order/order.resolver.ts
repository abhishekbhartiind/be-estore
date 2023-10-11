import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { HasRoles } from '@shared/decorator/role.decorator'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { Order } from '@feature/order/model/order.model'
import { RoleGuard } from '@shared/features/auth/guard/role.guard'
import { JwtAuthGuard } from '@shared/features/auth/guard/jwt-auth.guard'
import { Role } from '@feature/user/enum/role.enum'
import { OrderService } from '@feature/order/order.service'
import { UserService } from '@feature/user/user.service'
import { User } from '@feature/user/user.model'
import { CreateOrderInput } from '@feature/order/dto/create-order.input'

@Resolver()
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private userService: UserService,
  ) {}

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async currentOrders(@CurrentUser() currentUser: User): Promise<Order[]> {
    return await this.orderService.fetch({ user: { id: currentUser.id } })
  }

  @Query(() => Order)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async order(@Args('id') id: number): Promise<Order> {
    return await this.orderService.fetchOne(id)
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async createOrder(
    @CurrentUser() currentUser: User,
    @Args('data') order: CreateOrderInput,
  ): Promise<Order> {
    const user = await this.userService.fetchOne({
      id: currentUser.id as string,
    })
    return await this.orderService.save(order, user as User)
  }

  @Mutation(() => IUpdateResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async cancelOrder(@Args('id') id: number): Promise<IUpdateResponse> {
    return await this.orderService.cancel(id)
  }
}
