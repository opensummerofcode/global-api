import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  async confirmAccount(token: string, password: string): Promise<IUser> {
    const { sub: userId } = await this.authService.verify(token);
    const user = await this.userModel.findById(userId);
    if (!user.pending) throw new Error('Already verified!');
    return this.update({ password, pending: false }, user);
  }

  async update(input: any, user: IUser): Promise<IUser> {
    const fieldsToUp = { ...input };
    const { email, password } = input;
    if (email) {
      const emailAlreadyUsed = await this.findByEmail(email);
      if (emailAlreadyUsed) {
        throw new Error('Email already exists!');
      }
    }

    if (password) {
      fieldsToUp.password = await bcrypt.hash(password, 13);
    }

    return this.userModel.findByIdAndUpdate(user.id, fieldsToUp, { new: true });
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email });
  }

  checkCredentials(email: string, password: string): any {
    throw new Error('Method not implemented.');
  }
}
