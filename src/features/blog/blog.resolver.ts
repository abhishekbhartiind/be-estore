import { Query, Resolver } from '@nestjs/graphql'
import { BlogService } from '@feature/blog/blog.service'
import { BlogPost } from '@feature/blog/model/post.model'

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => [BlogPost])
  async blogPosts(): Promise<BlogPost[]> {
    return await this.blogService.fetch()
  }
}
