import { UserService } from '@app/shared/services/user.service';
import { createUserInput, UserType } from '@app/shared/types/user.type';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => [UserType])
  async listUsers(): Promise<UserType[]> {
    return await this.userService.listUsers();
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id') id: string): Promise<UserType> {
    return await this.userService.user(id);
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: createUserInput,
  ): Promise<UserType> {
    return await this.userService.updateUser(id, input);
  }

  @Mutation(() => UserType)
  async deleteUser(@Args('id') id: string): Promise<UserType> {
    return await this.userService.deleteUser(id);
  }
}
