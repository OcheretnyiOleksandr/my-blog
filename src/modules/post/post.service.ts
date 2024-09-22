import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(post: Post, userId: number) {
    const newPost = this.postRepository.create({
      ...post,
      user_id: userId,
    });

    await this.postRepository.save(newPost);
  }

  async getByUserId(userId: number): Promise<Post[]> {
    return await this.postRepository
      .findBy({ user_id: userId })
      .then((articles) =>
        articles.sort(
          (a1, a2) => a1.created_at.getTime() - a2.created_at.getTime(),
        ),
      );
  }
}
