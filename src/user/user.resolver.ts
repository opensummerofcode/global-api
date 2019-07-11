import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.type';

@Resolver(of => User)
export class UserResolver {
  //   constructor(
  //     private readonly authorsService: AuthorsService,
  //     private readonly postsService: PostsService,
  //   ) {}

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
    return { id: 'he,hdefsef', name, email };
  }

  //   @ResolveProperty()
  //   async posts(@Parent() author) {
  //     const { id } = author;
  //     return await this.postsService.findAll({ authorId: id });
  //   }
}
