import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    // check if a user exist
    const isUserExist = await this.findOneByEmail(email);

    if (isUserExist) {
      throw new ConflictException('User exist');
    }

    // has password
    const hashedPassword = await this.hashPassword(password);
    if (!hashedPassword) throw new ConflictException();
    createUserDto.password = hashedPassword;

    //save
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.findAllUsers();
  }

  async findOne(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException();

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.delete(id);
  }

  async hashPassword(text): Promise<string> {
    return await bcrypt.hash(text, 10);
  }
}
