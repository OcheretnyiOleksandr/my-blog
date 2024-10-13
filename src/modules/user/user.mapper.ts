import { User } from './user.entity';
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
}
