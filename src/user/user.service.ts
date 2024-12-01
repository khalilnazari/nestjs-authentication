import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { ForgetPasswordToken } from './entities/forgetPassword.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { EmailSubject, EmailType } from 'src/mailer/dto/mailer.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ForgetPasswordToken)
    private readonly forgetPasswordRepository: Repository<ForgetPasswordToken>,
    private readonly mailerService: MailerService,
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

  async changePassword(data: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = data;

    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException();

    const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!oldPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const newPasswordHashed = await this.hashPassword(newPassword);
    user.password = newPasswordHashed;

    return await this.userRepository.save(user);
  }

  async forgetPassword(data: ResetPasswordDto) {
    const user = await this.findOneByEmail(data.email);
    if (!user) {
      Logger.warn(__dirname, `User does not exist Email: ${data.email}`);
    }

    if (user) {
      await this.forgetPasswordRepository.delete(user.id);

      const tokenString = nanoid(64);
      const expiryDate = new Date();

      // Set expiry date 10 hours
      expiryDate.setHours(expiryDate.getMinutes() + 10);

      const data = this.forgetPasswordRepository.create({
        userId: user.id,
        token: tokenString,
        expiryDate,
      });

      const forgetPasswordLink = `http://localhost:3000/reset-password?token=${tokenString}`;

      // send email
      const emailType = EmailType.forgetPassword;
      const emailSubject = EmailSubject.forgetPassword;
      const emailData = {
        type: emailType,
        bodyData: {
          name: user.name,
          link: forgetPasswordLink,
          client: 'App',
        },
        recepientInfo: {
          to: user.email,
          subject: emailSubject,
        },
      };
      this.mailerService.sendMail(emailData);

      // save to db
      await this.forgetPasswordRepository.save(data);
    }

    return { message: 'Please check your email' };
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.delete(id);
  }

  async hashPassword(text: string): Promise<string> {
    return await bcrypt.hash(text, 10);
  }
}
