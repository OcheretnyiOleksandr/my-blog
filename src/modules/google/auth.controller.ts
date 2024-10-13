import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AuthController {
  constructor(private readonly googleService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('api/auth/google/')
  async googleAuth() {}

  @UseGuards(AuthGuard('google'))
  @Get('api/auth/google/callback')
  googleAuthRedirect(@Req() request: Request, @Res() response: Response) {
    return this.googleService.googleLogin(request, response);
  }
}
