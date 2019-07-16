import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  pending: { type: Boolean, default: true },
  chapters: [
    {
      type: 'ObjectId',
      ref: 'Chapter',
    },
  ],
});
