import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [String], {nullable: true})
  errors?: string[];

  @Field(() => User, {nullable: true})
  user?: User;
}

@Resolver()
export class UserResolver {
  readonly MIN_PASSWORD_LENGTH = 4;
  readonly MIN_USERNAME_LENGTH = 3;

  @Mutation(() => UserResponse)
  async register(
    @Arg('userInput') data: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (data.password.length <= this.MIN_PASSWORD_LENGTH || data.username.length <= this.MIN_USERNAME_LENGTH) {
      return {
        errors: ['Invalid username or password']
      }
    }
    const hashPassword = await argon2.hash(data.password);
    const user = em.create(User, {username: data.username, password: hashPassword});
    try {
      await em.persistAndFlush(user);
    } catch(error) {
      return {
        errors: ['Failed to create user. Please try again later']
      }
    };
    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('userInput') data: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em.findOneOrFail(User, {username: data.username});
      if (! await argon2.verify(user.password, data.password)) {
        throw 'Incorrect password';
      }
      return {user};
    } catch(error) {
      return {
        errors: ['Incorrect username or password']
      }
    }
  }
}