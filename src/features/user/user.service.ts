import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { User } from '@feature/user/user.model'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CreateUserInput } from '@feature/user/dto/create-user.input'
import { genSalt, hash } from 'bcrypt'
import { UpdateUserInput } from '@feature/user/dto/update-user.input'
import {
  RECORD_NOT_FOUND,
  TOKEN_INVALID,
} from '@shared/constant/error.constant'
import { userMock } from '@feature/user/user.mock'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mockUsers()
  }

  /**
   * Fetches all records
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetch(where?: object): Promise<User[]> {
    try {
      return await this.userRepo.find({
        ...(where && { where }),
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Fetch record by identifier
   * @param id Record identifier to be fetched
   * @param where If included, used sql where statement (javascript object syntax)
   */
  async fetchOne(id: string | null, where?: object) {
    try {
      if (id)
        return await this.userRepo.findOne({
          where: { id },
        })
      if (where)
        return await this.userRepo.findOne({
          where,
        })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Saves a record
   * @param user DTO
   */
  async save(user: CreateUserInput): Promise<User | UpdateResult> {
    try {
      const { email, password } = user

      const userFound = await this.userRepo.findOne({ where: { email } })
      if (userFound)
        return await this.userRepo.update(userFound.id as string, user)

      const salt = await genSalt()
      user.password = await hash(password, salt)

      return await this.userRepo.save(user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param user DTO
   */
  async update(id: string, user: UpdateUserInput): Promise<User> {
    try {
      const record = await this.userRepo.findOne({
        where: { id },
      })
      Object.assign(record as User, user)
      return await this.userRepo.save(record as User)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Deletes a record by identifier
   * @param id Record id identifier be soft deleted
   */
  async delete(id: string): Promise<DeleteResult> {
    try {
      return await this.userRepo.softDelete(id)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Restores a record by identifier
   * @param id Record identifier to be restored
   */
  async restore(id: string): Promise<UpdateResult> {
    try {
      const userRestored = await this.userRepo.restore(id)
      if (!userRestored)
        throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)

      return userRestored
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Changes user password
   * @param token UUID4 token
   * @param userPassword New password
   */
  async changePassword(
    token: string,
    userPassword: string,
  ): Promise<UpdateResult> {
    try {
      const user = await this.userRepo.findOneBy({ passwordToken: token })
      if (!user) throw new HttpException(TOKEN_INVALID, HttpStatus.NO_CONTENT)

      const salt = await genSalt()
      user.password = await hash(userPassword, salt)
      user.passwordToken = null
      user.passwordTokenCreated = null

      return await this.userRepo.update(user.id as string, user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Changes user email
   * @param token UUID4 token
   * @param userEmail New email
   */
  async changeEmail(token: string, userEmail: string): Promise<UpdateResult> {
    try {
      const user = await this.userRepo.findOneBy({ emailToken: token })
      if (!user) throw new HttpException(TOKEN_INVALID, HttpStatus.NO_CONTENT)

      user.email = userEmail
      user.emailToken = null
      user.emailTokenCreated = null

      return await this.userRepo.update(user.id as string, user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Activates user account (sets activated_at column)
   * @param token UUID4 token
   */
  async activateAccount(token: string): Promise<User> {
    try {
      const user = await this.fetchOne(null, { activateAccountToken: token })
      if (!user) throw new HttpException(TOKEN_INVALID, HttpStatus.UNAUTHORIZED)

      user.activated = new Date()
      user.activationToken = null

      return await this.update(user.id as string, user)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Inserts data into User table from `user.mock.ts`
   * Won't insert if data is found in table
   */
  async mockUsers(): Promise<any> {
    try {
      const users = await this.userRepo.find()
      if (users.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(userMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
