import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GqlChapter } from './types/chapter.type';
import { ChapterService } from './chapter.service';
import { UseGuards } from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';

@Resolver('Chapter')
export class ChapterResolver {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(Auth)
  @Mutation(returns => GqlChapter)
  async createChapter(@Args('name') name: string): Promise<GqlChapter> {
    return this.chapterService.createChapter(name);
  }
}
