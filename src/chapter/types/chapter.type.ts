import { Field, ObjectType, ID } from 'type-graphql';
import { User } from '../../user/user.type';
import { Edition } from './edition.type';

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

  @Field(type => [Edition], {
    description: 'Editions of a chapter',
    nullable: true,
  })
  editions?: Edition[];
}
