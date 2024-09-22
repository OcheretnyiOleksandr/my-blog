import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';
import { UserDto } from './dto/user.dto';
import { AuthenticationUserDto } from './dto/authentication-user.dto';

@ApiTags('User Controller')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get users information' })
  @ApiResponse({
    status: 200,
    description: 'User by ID Information',
  })
  @Get('users')
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.getAll();

    return users.map((user) => UserMapper.toDto(user));
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User by ID',
  })
  @ApiParam({
    description: 'User ID',
    name: 'userId',
  })
  @Get('user/:userId')
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    const user = this.userService.getById(userId);

    return user.then((u) => UserMapper.toDto(u));
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiBody({
    description: 'User request body',
    type: AuthenticationUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Create User',
  })
  @Post('create/user')
  async createUser(@Body() payload: AuthenticationUserDto) {
    const user = UserMapper.fromDto(payload);

    await this.userService.createUser(user);
  }
}
