import * as mongoose from 'mongoose';
import { EditionSchema } from './edition.schema';

export const ChapterSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
  },
  managers: [
    {
      type: 'ObjectId',
      ref: 'User',
    },
  ],
  editions: [EditionSchema],
});
