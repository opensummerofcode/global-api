import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

config();

@Module({
  imports: [
    UserModule,
    GraphQLModule.forRoot({ autoSchemaFile: 'schema.gql' }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useFindAndModify: false,
    }),
  ],
  // providers: [UsersService, ChaptersService],
})
export class AppModule {}
