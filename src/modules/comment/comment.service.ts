import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(comment: Comment, userId: number, postId: number) {
    const newComment = this.commentRepository.create({
      ...comment,
      user_id: userId,
      post_id: postId,
    });

    await this.commentRepository.save(newComment);
  }

  async getByPostId(postId: number): Promise<Comment[]> {
    return await this.commentRepository
      .findBy({ post_id: postId })
      .then((comments) =>
        comments.sort(
          (c1: Comment, c2: Comment) =>
            c1.createdAt.getTime() - c2.createdAt.getTime(),
        ),
      );
  }
}
