import { Document } from 'mongoose';

export interface Chapter extends Document {
  readonly id: string;
  readonly name: string;
}
