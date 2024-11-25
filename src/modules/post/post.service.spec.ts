import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostService', () => {
  let repository: jest.Mocked<Repository<Post>>;
  let service: PostService;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findBy: jest.fn(),
      findOneBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<Post>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save new post', async () => {
    const post: Post = {
      id: 1,
      user_id: 1,
      title: 'Title',
      article: 'Article',
      created_at: new Date(),
    };

    repository.create.mockReturnValue({ ...post, user_id: 1 });
    repository.save.mockResolvedValue({ ...post, user_id: 1 });

    await service.create(post, 1);

    expect(repository.create).toHaveBeenCalledWith({
      ...post,
      user_id: 1,
    });
    expect(repository.save).toHaveBeenCalledWith(post);
  });

  it('should return user post by user id', async () => {
    const post: Post = {
      id: 1,
      user_id: 1,
      title: 'Title',
      article: 'Article',
      created_at: new Date(),
    };

    repository.findBy.mockResolvedValue([post]);

    const actual = await service.getByUserId(1);

    expect(repository.findBy).toHaveBeenCalled();
    expect(actual).toEqual([post]);
  });

  it('should return post by id', async () => {
    const post: Post = {
      id: 1,
      user_id: 1,
      title: 'Title',
      article: 'Article',
      created_at: new Date(),
    };

    repository.findOneBy.mockResolvedValue(post);

    const actual = await service.getPostById(1);

    expect(repository.findOneBy).toHaveBeenCalled();
    expect(actual).toEqual(post);
  });
});
