import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GqlChapter } from './types/chapter.type';
import { ChapterService } from './chapter.service';
import { UseGuards } from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';

@Resolver('Chapter')
export class ChapterResolver {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(Auth)
  @Query(returns => [GqlChapter], { nullable: true })
  async chapters(): Promise<GqlChapter[]> {
    return this.chapterService.chapters();
  }

  @UseGuards(Auth)
  @Mutation(returns => GqlChapter)
  async createChapter(@Args('name') name: string): Promise<GqlChapter> {
    return this.chapterService.createChapter(name);
  }

  @UseGuards(Auth)
  @Mutation(returns => GqlChapter)
  async deleteChapter(@Args('id') id: string): Promise<GqlChapter> {
    return this.chapterService.delete(id);
  }
}
