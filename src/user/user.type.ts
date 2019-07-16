import { Field, ObjectType, ID } from 'type-graphql';
import { Chapter } from '../chapter/types/chapter.type';

@ObjectType({ description: 'User model' })
export class User {
  @Field(() => ID, { description: 'User ID' })
  id?: string;

  @Field({ description: 'User fullname (firstname & lastname)' })
  name: string;

  @Field({ description: 'User email' })
  email: string;

  @Field({ nullable: true })
  role?: string;

  @Field(type => [Chapter], {
    description: 'Chapters of the user',
    nullable: true,
  })
  chapters?: Chapter[];
}
