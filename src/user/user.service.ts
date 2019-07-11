import { Injectable } from '@nestjs/common';
import { IUser } from 'dist/user/interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(user: User): Promise<IUser> {
    const createdCat = new this.userModel(user);
    return await createdCat.save();
  }
}
