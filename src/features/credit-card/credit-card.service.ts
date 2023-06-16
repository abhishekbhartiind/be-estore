import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreditCard } from '@feature/credit-card/credit-card.model'
import { creditCardMock } from '@feature/credit-card/credit-card.mock'
import { DeleteResult } from '@shared/dto/typeorm-result.dto'
import { CreateCreditCardInput } from '@feature/credit-card/dto/create-credit-card.input'
import { CREDIT_CARD_RELATIONS } from '@feature/credit-card/constant/entity-relation.constant'

@Injectable()
export class CreditCardService implements OnModuleInit {
  constructor(
    @InjectRepository(CreditCard)
    private readonly paymentRepo: Repository<CreditCard>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mockCards()
  }

  /**
   * Fetches all records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetch(where?: object): Promise<CreditCard[]> {
    try {
      return await this.paymentRepo.find({
        ...(where && { where }),
        relations: CREDIT_CARD_RELATIONS,
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param creditCard DTO
   * @param userId User id the card belongs to
   */
  async save(
    creditCard: CreateCreditCardInput,
    userId: string,
  ): Promise<CreditCard> {
    try {
      return await this.paymentRepo.save({
        ...creditCard,
        user: { id: userId },
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Deletes a record by id
   * @param id Record id to be soft deleted
   */
  async delete(id: string): Promise<DeleteResult> {
    try {
      return await this.paymentRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into Address table from `credit-card.mock.ts`
   * Won't insert if data is found in table
   */
  async mockCards(): Promise<any> {
    try {
      const cards = await this.paymentRepo.find()
      if (cards.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(CreditCard)
          .values(creditCardMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
