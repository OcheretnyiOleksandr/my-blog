import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(post: Post, userId: number) {
    const newPost = this.postRepository.create({
      ...post,
      user_id: userId,
    });

    await this.postRepository.save(newPost);
  }

  async getByUserId(userId: number): Promise<Post[]> {
    const articles = await this.postRepository.findBy({ user_id: userId });
    if (!articles) {
      throw new NotFoundException(`No articles found for userId:${userId}`);
    }

    return articles.sort(
      (a1, a2) => a1.created_at.getTime() - a2.created_at.getTime(),
    );
  }

  async getPostById(id: number): Promise<Post> {
    const article = await this.postRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException(`No articles found for articleId:${id}`);
    }

    return article;
  }
}
