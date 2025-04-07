import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { createUserInput, UserType } from 'types/user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Query(() => [UserType])
  async listUsers(): Promise<UserType[]> {
    return this.userRepo.find({
      relations: ['reservations', 'reservations.user'],
    });
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id') id: string): Promise<UserType> {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: createUserInput): Promise<UserType> {
    const newUser = this.userRepo.create(input);
    const user = await this.userRepo.save(newUser);
    return this.userRepo.findOneOrFail({ where: { id: user.id } });
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: createUserInput,
  ): Promise<UserType> {
    await this.userRepo.update({ id }, input);
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => UserType)
  async deleteUser(@Args('id') id: string): Promise<UserType> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    await this.userRepo.delete({ id });
    return user;
  }
}
