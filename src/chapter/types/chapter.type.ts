import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType({ description: 'Chapter model' })
export class GqlChapter {
  @Field(() => ID, { description: 'Chapter ID' })
  id: string;

  @Field({ description: 'Chapter name' })
  name: string;
}
