import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Chapter } from './types/chapter.type';
import { ChapterService } from './chapter.service';
import { UseGuards } from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Int } from 'type-graphql';

@Resolver(of => Chapter)
export class ChapterResolver {
  constructor(private readonly chapterService: ChapterService) {}

  @Roles('ADMIN')
  @UseGuards(Auth)
  @Query(returns => [Chapter], { nullable: true })
  async chapters(): Promise<Chapter[]> {
    return this.chapterService.chapters();
  }

  @Roles('ADMIN')
  @UseGuards(Auth)
  @Mutation(returns => Chapter)
  async createChapter(@Args('name') name: string): Promise<Chapter> {
    return this.chapterService.createChapter(name);
  }

  @Roles('ADMIN')
  @UseGuards(Auth)
  @Mutation(returns => Chapter)
  async deleteChapter(@Args('id') id: string): Promise<Chapter> {
    return this.chapterService.delete(id);
  }

  @UseGuards(Auth)
  @Mutation(returns => Chapter)
  async addManager(
    @Args('userId') userId: string,
    @Args('chapterId') chapterId: string,
  ): Promise<Chapter> {
    return this.chapterService.addManager(userId, chapterId);
  }

  @UseGuards(Auth)
  @Mutation(returns => Chapter)
  async removeManager(
    @Args('userId') userId: string,
    @Args('chapterId') chapterId: string,
  ): Promise<Chapter> {
    return this.chapterService.remove(userId, chapterId);
  }

  @UseGuards(Auth)
  @Mutation(returns => Chapter)
  async newEdition(
    @Args('chapterId') chapterId: string,
    @Args({ name: 'year', type: () => Int }) year: number,
    @Args('uri') uri: string,
  ): Promise<Chapter> {
    return this.chapterService.addEdition(chapterId, year, uri);
  }

  @ResolveProperty()
  async managers(@Parent() chapter) {
    return this.chapterService.managers(chapter);
  }
}
