import { Document } from 'mongoose';
import { IUser } from 'dist/user/interfaces/user.interface';

export interface IChapter extends Document {
  readonly id: string;
  readonly name: string;
  readonly managers?: IUser[];
}
