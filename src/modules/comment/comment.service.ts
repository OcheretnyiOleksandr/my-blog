import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getCommentByPostId(postId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.findBy({ post_id: postId });
    if (!comments) {
      throw new NotFoundException(`No comments found for articleId:${postId}`);
    }

    return comments.sort(
      (c1: Comment, c2: Comment) =>
        c1.created_at.getTime() - c2.created_at.getTime(),
    );
  }
}
