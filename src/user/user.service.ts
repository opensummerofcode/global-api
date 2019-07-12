import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(user: User): Promise<IUser> {
    const savedUser = await new this.userModel(user).save();
    const accountConfirmationToken = await this.authService.accountConfirmationToken(
      savedUser,
    );
    const { email, name } = savedUser;
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@nestjs.com',
      subject: 'Invitation to join #oSocTeam',
      text: `Hi ${name}, you have been invited to join the oSoc team. Here's your account confirmation token: ${accountConfirmationToken}`,
      html: `Hi ${name}, <br />You have been invited to join the oSoc team.
      <br /> Here's your account confirmation token: ${accountConfirmationToken}`,
    });
    return savedUser;
  }

  checkCredentials(email: string, password: string): any {
    throw new Error('Method not implemented.');
  }
}
