import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const googleUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    picture: 'http://example.com/avatar.jpg',
  };

  const user = {
    id: 123,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    avatar_url: 'http://example.com/avatar.jpg',
  };

  beforeEach(async () => {
    userService = {
      getByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return 401 when google user is dont provided', async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    await authService.googleLogin({ user: null } as Request, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: 'No user from google',
    });
  });

  it('should should create new user and set JWR to cookies', async () => {
    const response = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    userService.getByEmail.mockResolvedValue(null);
    userService.createUser.mockResolvedValue(user);
    jwtService.sign.mockReturnValue('jwt-token');

    await authService.googleLogin(
      { user: googleUser } as unknown as Request,
      response,
    );

    expect(userService.getByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        avatar_url: 'http://example.com/avatar.jpg',
      }),
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      id: user.id,
    });
    expect(response.cookie).toHaveBeenCalledWith('jwt', 'jwt-token', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    expect(response.redirect).toHaveBeenCalledWith('/articles?userId=123');
  });

  it('should login if user already exist and set JWT to cookies', async () => {
    const response = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    userService.getByEmail.mockResolvedValue(user);
    jwtService.sign.mockReturnValue('jwt-token');

    await authService.googleLogin(
      { user: googleUser } as unknown as Request,
      response,
    );

    expect(userService.getByEmail).toHaveBeenCalledWith(googleUser.email);
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      id: user.id,
    });
    expect(response.cookie).toHaveBeenCalledWith('jwt', 'jwt-token', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    expect(response.redirect).toHaveBeenCalledWith('/articles?userId=123');
  });
});
