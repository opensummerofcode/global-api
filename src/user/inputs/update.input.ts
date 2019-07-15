import { InputType, Field, Int } from 'type-graphql';
import { MinLength, IsEmail } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({
    description: 'User fullname (firstname & lastname)',
    nullable: true,
  })
  name?: string;

  @Field({ description: 'User email', nullable: true })
  email?: string;

  @Field({ description: 'User password', nullable: true })
  password?: string;
}
