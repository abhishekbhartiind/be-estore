import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from '@config/database.config'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from '@feature/product/product.module'
import { join } from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { UserModule } from '@feature/user/user.module'
import { MailModule } from '@shared/features/mail/mail.module'
import { AuthModule } from '@shared/features/auth/auth.module'
import { OrderModule } from '@feature/order/order.module'
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'
import { RatingModule } from '@feature/product/features/rating/rating.module'
import { AddressModule } from '@feature/address/address.module'
import { CreditCardModule } from '@feature/credit-card/credit-card.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import 'reflect-metadata'

@Module({
  imports: [
    UserModule,
    CreditCardModule,
    AddressModule,
    AuthModule,
    BrandModule,
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd() + '/src/schema.graphql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      cors: {
        origin: [process.env.FRONTEND_HOST, process.env.APOLLO_STUDIO],
        credentials: true,
      },
    }),
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ProductModule,
    OrderModule,
    RatingModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
  ],
})
export class AppModule {}
