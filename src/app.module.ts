import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from '@config/database.config'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from '@feature/product/product.module'
import { join } from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { UserModule } from '@feature/user/user.module'
import { MailModule } from '@shared/features/mail/mail.module'
import { AuthModule } from '@shared/features/auth/auth.module'
import { OrderModule } from '@feature/order/order.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd() + '/src/schema.graphql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    MailModule,
    OrderModule,
    ProductModule,
    UserModule,
  ],
})
export class AppModule {}
