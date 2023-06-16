import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreditCard } from '@feature/credit-card/credit-card.model'
import { CreditCardService } from '@feature/credit-card/credit-card.service'
import { CreditCardResolver } from '@feature/credit-card/credit-card.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard])],
  providers: [CreditCardService, CreditCardResolver],
  exports: [CreditCardService],
})
export class CreditCardModule {}
