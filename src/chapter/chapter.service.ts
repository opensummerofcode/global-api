import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './interfaces/chapter.interface';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
  ) {}

  async createChapter(name: string) {
    return new this.chapterModel({ name }).save();
  }
}
