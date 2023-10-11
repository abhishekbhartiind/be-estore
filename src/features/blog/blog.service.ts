import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BlogPost } from '@feature/blog/model/post.model'
import { postMock } from '@feature/blog/mock/post.mock'

@Injectable()
export class BlogService implements OnModuleInit {
  constructor(
    @InjectRepository(BlogPost)
    private readonly postRepo: Repository<BlogPost>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mockPosts()
  }

  /*
   * Fetches all post records
   */
  async fetch(): Promise<any> {
    try {
      return this.postRepo.find()
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /*
   * Inserts data into `blogPost` table from `post.mock.ts`
   * Only inserts data upon empty table
   */
  async mockPosts(): Promise<any> {
    try {
      const posts = await this.postRepo.find()
      if (posts.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(BlogPost)
          .values(postMock)
          .execute()
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
