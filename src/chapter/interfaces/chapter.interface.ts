import { Document } from 'mongoose';
import { IUser } from '../../user/interfaces/user.interface';

export interface IChapter extends Document {
  readonly id: string;
  readonly name: string;
  readonly managers?: IUser[];
}
