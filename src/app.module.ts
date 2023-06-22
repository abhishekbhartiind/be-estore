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
import { BrandModule } from '@feature/product/features/brand/brand.module'
import { CategoryModule } from '@feature/product/features/category/category.module'
import { SpecificationModule } from '@feature/product/features/specification/specification.module'
import { RatingModule } from '@feature/product/features/rating/rating.module'
import { AddressModule } from '@feature/address/address.module'
import { CreditCardModule } from '@feature/credit-card/credit-card.module'

@Module({
  imports: [
    UserModule,
    CreditCardModule,
    AddressModule,
    AuthModule,
    BrandModule,
    CategoryModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd() + '/src/schema.graphql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      cors: {
        origin: 'http://localhost:4000',
        credentials: true,
      },
    }),
    MailModule,
    SpecificationModule,
    ProductModule,
    OrderModule,
    RatingModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
  ],
})
export class AppModule {}
