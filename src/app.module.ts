import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from '@config/database.config'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from '@feature/product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ProductModule,
  ],
})
export class AppModule {}
