import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IChapter } from './interfaces/chapter.interface';
import { IUser } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel('Chapter') private readonly chapterModel: Model<IChapter>,
    private readonly userService: UserService,
  ) {}

  async createChapter(name: string) {
    return new this.chapterModel({ name }).save();
  }

  async addManager(userId: string, chapterId: string): Promise<IChapter> {
    const session = await this.chapterModel.db.startSession();
    let updatedChapter = null;
    try {
      session.startTransaction();
      await this.userService.linkToChapter(userId, chapterId, session);
      updatedChapter = await this.update(
        { chapterId, update: { $push: { managers: userId } } },
        session,
      );
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    }
    return updatedChapter;
  }

  async remove(userId: string, chapterId: string): Promise<IChapter> {
    const session = await this.chapterModel.db.startSession();
    let updatedChapter = null;
    try {
      session.startTransaction();
      await this.userService.unlinkFromChapter(userId, chapterId, session);
      updatedChapter = await this.update(
        { chapterId, update: { $pull: { managers: userId } } },
        session,
      );
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    }
    return updatedChapter;
  }

  async update(elements: any, session?: any): Promise<IChapter> {
    return this.chapterModel
      .findByIdAndUpdate(elements.chapterId, elements.update, { new: true })
      .session(session);
  }

  async delete(id: string): Promise<IChapter> {
    // TODO delete chapter ref from its managers
    return this.chapterModel.findByIdAndDelete(id);
  }

  async chapters(): Promise<IChapter[]> {
    return this.chapterModel.find();
  }

  async managers(chapter: IChapter): Promise<IUser[]> {
    const populatedChapter = await chapter.populate('managers').execPopulate();
    return populatedChapter.managers;
  }

  async addEdition(
    chapterId: string,
    year: number,
    uri: string,
  ): Promise<IChapter> {
    // TODO fix subdoc uri field uniqueness
    return this.update({
      chapterId,
      update: { $push: { editions: { year, uri } } },
    });
  }
}
