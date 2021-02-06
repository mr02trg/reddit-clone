import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class UserError {
  @Field({nullable: true})
  field?: string;

  @Field()
  errorMsg: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserError], {nullable: true})
  errors?: UserError[];

  @Field(() => User, {nullable: true})
  user?: User;
}

@Resolver()
export class UserResolver {
  readonly MIN_PASSWORD_LENGTH = 4;
  readonly MIN_USERNAME_LENGTH = 3;

  // check if user is login
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() { req, em }: MyContext
  ): Promise<User | null> {
    // user not login
    if (! req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, {id: req.session.userId});
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('userInput') data: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    let errors: UserError[] = [];
    if (data.password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push({
        field: 'password',
        errorMsg: 'Password is too short'
      })
    }
    
    if (data.username.length < this.MIN_USERNAME_LENGTH) {
      errors.push({
        field: 'username',
        errorMsg: 'Username is too short'
      })
    }

    if (errors && errors.length > 0) {
      return {errors};
    }

    const hashPassword = await argon2.hash(data.password);
    const user = em.create(User, {username: data.username, password: hashPassword});
    try {
      await em.persistAndFlush(user);
    } catch(error) {

      console.log(error);
      let err: UserError[];
      if (error.code == 23505) {
          err = [{
            field: 'username',
            errorMsg: error?.detail
          }]
      } else {
        err = [{
          errorMsg: 'Failed to create user. Please try again later'
        }]
      }
      return {errors: err}
    };
    return {user};
  }

  // mutation {
  //   login(userInput: {username: '', password: ''}) {
  //     errors,
  //     user {
  //       id,
  //       username
  //     }
  //   }
  // }
  @Mutation(() => UserResponse)
  async login(
    @Arg('userInput') data: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await em.findOneOrFail(User, {username: data.username});
      if (! await argon2.verify(user.password, data.password)) {
        throw 'Incorrect password';
      }

      // set user session after login
      req.session.userId = user.id;
      
      return {user};
    } catch(error) {
      return {
        errors: [{
          errorMsg: 'Incorrect username or password'
        }]
      }
    }
  }
}