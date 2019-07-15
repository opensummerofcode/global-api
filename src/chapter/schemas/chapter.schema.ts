import * as mongoose from 'mongoose';

export const ChapterSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
  },
});
