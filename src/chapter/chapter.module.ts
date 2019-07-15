import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterResolver } from './chapter.resolver';

@Module({
  providers: [ChapterService, ChapterResolver]
})
export class ChapterModule {}
