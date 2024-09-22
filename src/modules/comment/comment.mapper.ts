import { Comment } from './comment.entity';
import { CommentDto } from './comment.dto';

export class CommentMapper {
  static fromDto(dto: CommentDto): Comment {
    const comment = new Comment();
    comment.comment = dto.comment;
    comment.createdAt = new Date();

    return comment;
  }

  static toDto(entity: Comment): CommentDto {
    const dto = new CommentDto();
    dto.comment = entity.comment;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
