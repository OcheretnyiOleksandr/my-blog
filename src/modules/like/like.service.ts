import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async like(userId: number, postId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (like) {
      await this.unlike(userId, postId);

      return Promise.resolve();
    }

    const newLike = this.likeRepository.create({
      user_id: userId,
      post_id: postId,
    });

    await this.likeRepository.save(newLike);

    return Promise.resolve();
  }

  async unlike(userId: number, postId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (!like) return Promise.resolve();

    await this.likeRepository.delete({ user_id: userId, post_id: postId });

    return Promise.resolve();
  }

  async countLikes(postId: number): Promise<number> {
    return await this.likeRepository.count({ where: { post_id: postId } });
  }
}
