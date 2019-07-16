import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType({ description: 'Chapter model' })
export class Edition {
  @Field(type => Int)
  year: number;

  @Field()
  uri: string;
}
