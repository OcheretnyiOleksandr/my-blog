import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Request, Response } from 'express';
import { GoogleUser } from './google.user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(request: Request, response: Response): Promise<any> {
    if (!request.user) {
      return response.status(401).json({ message: 'No user from google' });
    }

    const googleProfile = request.user as GoogleUser;

    const user = await this.userService.getByEmail(googleProfile.email);
    if (!user) {
      const newUser = new User();
      newUser.first_name = googleProfile.firstName;
      newUser.last_name = googleProfile.lastName;
      newUser.email = googleProfile.email;
      newUser.avatar_url = googleProfile.picture;

      const createdUser = await this.userService.createUser(newUser);
      const payload = {
        email: createdUser.email,
        id: createdUser.id,
      };

      const jwtToken = this.jwtService.sign(payload);
      this.setCookies(response, jwtToken);

      return response
        .status(201)
        .json({ message: 'User created and logged in' });
    }

    const payload = {
      email: user.email,
      id: user.id,
    };

    const jwtToken = this.jwtService.sign(payload);
    this.setCookies(response, jwtToken);

    response.status(200).json({ message: 'User logged in' });
  }

  private setCookies(response, token: string) {
    response.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
}
