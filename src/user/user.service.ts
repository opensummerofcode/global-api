import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nest-modules/mailer';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { IChapter } from '../chapter/interfaces/chapter.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(user: any): Promise<IUser> {
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

  async update(input: any, user: any): Promise<IUser> {
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

  async findById(id: string): Promise<IUser> {
    return this.userModel.findById(id);
  }

  async checkCredentials(email: string, password: string): Promise<IUser> {
    const user = await this.findByEmail(email);
    const result = user && (await bcrypt.compare(password, user.password));
    if (!result) throw new UserInputError('Email or password incorrect!');
    return user;
  }

  async users(): Promise<IUser[]> {
    return this.userModel.find();
  }

  async delete(user: any) {
    return this.userModel.findByIdAndDelete(user.id);
  }

  async linkToChapter(
    userId: string,
    chapterId: string,
    session: any,
  ): Promise<void> {
    return this.userModel
      .updateOne({ _id: userId }, { $push: { chapters: chapterId } })
      .session(session);
  }

  async unlinkFromChapter(
    userId: string,
    chapterId: string,
    session: any,
  ): Promise<void> {
    return this.userModel
      .updateOne({ _id: userId }, { $pull: { chapters: chapterId } })
      .session(session);
  }

  async chapters(user: IUser): Promise<IChapter[]> {
    const populatedUser = await user.populate('chapters').execPopulate();
    return populatedUser.chapters;
  }
}
