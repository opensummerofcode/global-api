import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.type';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async hello(): Promise<User> {
    return {
      name: 'Ismaila',
      id: 'HJKLLLL3L22L3L',
      email: 'isma@isma.be',
    };
  }

  @Mutation(returns => User)
  async addUser(
    @Args('name')
    name: string,
    @Args('email') email: string,
  ): Promise<User> {
    return this.userService.create({email, name})
  }

  //   @ResolveProperty()
  //   async posts(@Parent() author) {
  //     const { id } = author;
  //     return await this.postsService.findAll({ authorId: id });
  //   }
}
