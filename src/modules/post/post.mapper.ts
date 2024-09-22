import { PostDto } from './post.dto';
import { Post } from './post.entity';

export class PostMapper {
  static fromDto(dto: PostDto): Post {
    const post = new Post();
    post.title = dto.title;
    post.article = dto.article;
    post.created_at = new Date();

    return post;
  }

  static toDto(entity: Post): PostDto {
    const post = new PostDto();
    post.title = entity.title;
    post.article = entity.article;
    post.createdAt = entity.created_at;

    return post;
  }
}
