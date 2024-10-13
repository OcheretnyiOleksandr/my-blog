import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User Controller')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
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
