import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let repository: jest.Mocked<Repository<Comment>>;
  let service: CommentService;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<Comment>>;

    const module = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save new comment', async () => {
    const comment: Comment = {
      id: 1,
      user_id: null,
      post_id: null,
      comment: 'Comment',
      created_at: new Date(),
    };

    repository.create.mockReturnValue({ ...comment, user_id: 1, post_id: 2 });
    repository.save.mockResolvedValue({ ...comment, user_id: 1, post_id: 2 });

    await service.createComment(comment, 1, 2);

    expect(repository.create).toHaveBeenCalledWith({
      ...comment,
      user_id: 1,
      post_id: 2,
    });
    expect(repository.save).toHaveBeenCalledWith({
      ...comment,
      user_id: 1,
      post_id: 2,
    });
  });

  it('should return comment by post id', async () => {
    const comment: Comment = {
      id: 1,
      user_id: 1,
      post_id: 2,
      comment: 'Comment',
      created_at: new Date(),
    };

    repository.findBy.mockResolvedValue([comment]);

    const actual = await service.getCommentByPostId(1);

    expect(repository.findBy).toHaveBeenCalled();
    expect(actual).toEqual([comment]);
  });

  it('should return NotFoundException', async () => {
    jest.spyOn(service, 'getCommentByPostId').mockImplementation(() => {
      throw new NotFoundException(`No comments found for articleId:${123}`);
    });

    repository.findBy.mockResolvedValue(null);

    expect(repository.findBy).not.toHaveBeenCalled();
    expect(() => service.getCommentByPostId(123)).toThrow(NotFoundException);
  });
});
