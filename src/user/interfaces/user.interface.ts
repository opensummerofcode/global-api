import { Document } from 'mongoose';
import { IChapter } from 'src/chapter/interfaces/chapter.interface';

export interface IUser extends Document {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly pending: boolean;
  readonly chapters?: IChapter[];
}
