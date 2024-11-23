import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let repository: jest.Mocked<Repository<User>>;
  let service: UserService;

  beforeEach(async () => {
    repository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save new user', async () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Silver',
      email: 'email',
      avatar_url: 'avatar',
    };

    repository.save.mockResolvedValue(user);

    const actual = await service.createUser(user);

    expect(repository.save).toHaveBeenCalledWith(user);
    expect(actual).toEqual(user);
  });

  it('should return user by id', async () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Silver',
      email: 'email',
      avatar_url: 'avatar',
    };

    repository.findOneBy.mockResolvedValue(user);

    const actual = await service.getById(1);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(actual).toEqual(user);
  });

  it('should return user by email', async () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Silver',
      email: 'email',
      avatar_url: 'avatar',
    };

    repository.findOneBy.mockResolvedValue(user);

    const actual = await service.getByEmail('email');

    expect(repository.findOneBy).toHaveBeenCalledWith({ email: 'email' });
    expect(actual).toEqual(user);
  });

  it('should return all users', async () => {
    const users: User[] = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Silver',
        email: 'email',
        avatar_url: 'avatar',
      },
      {
        id: 2,
        first_name: 'Mer',
        last_name: 'Bom',
        email: 'email',
        avatar_url: 'avatar',
      },
    ];

    repository.find.mockResolvedValue(users);

    const actual = await service.getAll();

    expect(repository.find).toHaveBeenCalled();
    expect(actual).toEqual(users);
  });
});
