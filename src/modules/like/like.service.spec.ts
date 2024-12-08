import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { LikeService } from './like.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LikeService', () => {
  let repository: jest.Mocked<Repository<Like>>;
  let service: LikeService;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<Like>>;

    const module = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getRepositoryToken(Like),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return promise resolve when like present', async () => {
    const like: Like = {
      id: 1,
      post_id: 2,
      user_id: 3,
    };
    repository.findOne.mockResolvedValue(like);
    repository.delete.mockResolvedValue({ affected: 2 } as any);

    expect(service.like(3, 2)).toEqual(Promise.resolve());
  });

  it('should create new like', async () => {
    const like: Like = {
      id: 1,
      post_id: 2,
      user_id: 3,
    };
    repository.findOne.mockResolvedValue(null);
    repository.create.mockReturnValue(like);
    repository.save.mockResolvedValue(like);

    await service.like(3, 2);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { post_id: 2, user_id: 3 },
    });
    expect(repository.create).toHaveBeenCalledWith({
      post_id: 2,
      user_id: 3,
    });
    expect(repository.save).toHaveBeenCalledWith(like);
  });

  it('should delete like', async () => {
    const like: Like = {
      id: 1,
      post_id: 2,
      user_id: 3,
    };

    repository.findOne.mockResolvedValue(like);
    repository.delete.mockResolvedValue({ affected: 1 } as any);

    await service.unlike(3, 2);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { post_id: 2, user_id: 3 },
    });
    expect(repository.delete).toHaveBeenCalledWith({
      post_id: 2,
      user_id: 3,
    });
  });

  it('should return promise resolve when like does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    expect(service.unlike(3, 2)).toEqual(Promise.resolve());
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { post_id: 2, user_id: 3 },
    });
  });

  it('should return count of likes', async () => {
    repository.count.mockResolvedValue(2);

    const actual = await service.countLikes(1);

    expect(repository.count).toHaveBeenCalledWith({
      where: { post_id: 1 },
    });
    expect(actual).toEqual(2);
  });
});
