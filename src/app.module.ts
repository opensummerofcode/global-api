import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { UsersService } from './users/users.resolver';
// import { ChaptersService } from './chapters/chapters.service';

@Module({
  imports: [
    GraphQLModule.forRoot({ autoSchemaFile: 'schema.gql' }),
  ],
  // providers: [UsersService, ChaptersService],
})
export class AppModule {}
