import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly pending: boolean;
}
