import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { includes } from 'lodash';
import { COOKIE_NAME } from "../constants";
import { validateUserRegister } from "../utils/userValidationHelper";
import { sendResetPasswordEmail } from "../utils/sendMail";

@InputType()
export class UserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class UserRegisterRequest extends UserInput {
  @Field()
  email: string;
}

@ObjectType()
export class UserError {
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
    @Arg('userInput') data: UserRegisterRequest,
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateUserRegister(data);
    if (errors && errors.length > 0) {
      return {errors};
    }

    const hashPassword = await argon2.hash(data.password);
    const user = em.create(User, {username: data.username, email: data.email, password: hashPassword});
    try {
      await em.persistAndFlush(user);

      // log user in after successful register
      req.session.userId = user.id;
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
      // user can login with either email or password
      const user = await em.findOneOrFail(User, 
        includes(data.username, '@') ? 
        {email: data.username}: 
        {username: data.username});

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

  @Mutation(() => Boolean)
  logout(
    @Ctx() {req, res}: MyContext
  ): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em} : MyContext
  ): Promise<Boolean> {
    const user = await em.findOne(User, {email});
    if (!user) {
      return true;
    }
    await sendResetPasswordEmail(user.username, user.email);
    return true;
  }
}