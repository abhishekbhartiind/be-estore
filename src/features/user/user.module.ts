import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@feature/user/user.model'
import { UserService } from '@feature/user/user.service'
import { UserResolver } from '@feature/user/user.resolver'
import { UserAdminResolver } from '@feature/user/user.resolver.admin'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver, UserAdminResolver],
  exports: [UserService],
})
export class UserModule {}
