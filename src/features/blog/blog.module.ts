import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlogPost } from '@feature/blog/model/post.model'
import { BlogResolver } from '@feature/blog/blog.resolver'
import { BlogService } from '@feature/blog/blog.service'

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  providers: [BlogResolver, BlogService],
  exports: [BlogService],
})
export class BlogModule {}
