import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly mailerService: MailerService,
  ) {}

  async create(user: User): Promise<IUser> {
    const savedUser = await new this.userModel(user).save();
    const { email, name } = savedUser;
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@nestjs.com',
      subject: 'Invitation to join #oSocTeam',
      text: `Hi ${name}, you have been invited to join the oSoc team.`,
      html: `Hi ${name}, <br /> You have been invited to join the oSoc team.`,
    });
    return savedUser;
  }
}
