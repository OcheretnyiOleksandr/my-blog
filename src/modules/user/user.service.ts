import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(user: User) {
    const { password, ...userData } = user;

    const encryptedPassword =
      await this.passwordService.encryptPassword(password);
    const encryptedUser = this.userRepository.create({
      ...userData,
      password: encryptedPassword,
    });

    await this.userRepository.save(encryptedUser);
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
