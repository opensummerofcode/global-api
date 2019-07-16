import { Field, ObjectType, ID } from 'type-graphql';
import { User } from '../../user/user.type';

@ObjectType({ description: 'Chapter model' })
export class Chapter {
  @Field(() => ID, { description: 'Chapter ID' })
  id: string;

  @Field({ description: 'Chapter name' })
  name: string;

  @Field(type => [User], {
    description: 'Managers of a chapter',
    nullable: 'itemsAndList',
  })
  managers?: User[];
}
