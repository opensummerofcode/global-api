import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterResolver } from './chapter.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from './schemas/chapter.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
  ],
  providers: [ChapterService, ChapterResolver],
})
export class ChapterModule {}
