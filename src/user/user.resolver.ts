import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.type';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from './decorators/current-user-decorator';
import { UseGuards } from '@nestjs/common';
import { Guest } from '../auth/guards/guest.guard';

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(returns => User)
  async me(@CurrentUser() user: any): Promise<User> {
    return user;
  }

  @Mutation(returns => User)
  async addUser(
    @Args('name')
    name: string,
    @Args('email') email: string,
  ): Promise<User> {
    return this.userService.create({ email, name });
  }

  @UseGuards(Guest)
  @Mutation(returns => User)
  async confirmAccount(
    @Args('token')
    token: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.userService.confirmAccount(token, password);
  }

  @UseGuards(Guest)
  @Mutation(returns => User)
  async login(
    @Args('email')
    email: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ): Promise<User> {
    return this.authService.login(email, password, ctx);
  }

  //   @ResolveProperty()
  //   async posts(@Parent() author) {
  //     const { id } = author;
  //     return await this.postsService.findAll({ authorId: id });
  //   }
}
