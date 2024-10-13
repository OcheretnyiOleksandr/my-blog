import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
      secretOrKey: configService.get<string>('SECRET_TOKEN'),
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
