import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByCognitoSub(cognitoSub: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { cognitoSub } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }


  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.userRepository.delete({});
  }
}
