import { User } from './user.entity';
import { AuthenticationUserDto } from './dto/authentication-user.dto';
import { UserDto } from './dto/user.dto';

export class UserMapper {
  static toDto(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.firstName = user.first_name;
    dto.lastName = user.last_name;
    dto.email = user.email;

    return dto;
  }

  static fromDto(dto: AuthenticationUserDto): User {
    const user = new User();
    user.first_name = dto.firstName;
    user.last_name = dto.lastName;
    user.email = dto.email;
    user.password = dto.password;

    return user;
  }
}
