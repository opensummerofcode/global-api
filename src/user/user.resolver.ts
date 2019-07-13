import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.type';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from './decorators/current-user-decorator';
import { UseGuards } from '@nestjs/common';
import { Guest } from '../auth/guards/guest.guard';
import { Auth } from '../auth/guards/auth.guard';

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(Auth)
  @Query(returns => User)
  async me(@CurrentUser() user: any): Promise<User> {
    return user;
  }

  @UseGuards(Auth)
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

  @UseGuards(Auth)
  @Mutation(returns => Boolean)
  logout(@Context('res') res: any): boolean {
    return this.authService.logout(res);
  }

  @UseGuards(Auth)
  @Query(returns => [User], { nullable: true })
  async users(): Promise<User[]> {
    return this.userService.users();
  }

  //   @ResolveProperty()
  //   async posts(@Parent() author) {
  //     const { id } = author;
  //     return await this.postsService.findAll({ authorId: id });
  //   }
}
