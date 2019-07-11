import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType({ description: 'User model' })
export class User {
  @Field(() => ID, { description: 'User ID' })
  id?: string;

  @Field({ description: 'User fullname (firstname & lastname)' })
  name: string;

  @Field({ nullable: true, description: 'User password' })
  password?: string;

  @Field({ description: 'User email' })
  email: string;

  @Field({ nullable: true })
  role?: string;
}
