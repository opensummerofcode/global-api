import * as mongoose from 'mongoose';

export const EditionSchema = new mongoose.Schema(
  {
    year: Number,
    uri: {
      unique: true,
      type: String,
    },
  },
  { _id: false },
);
