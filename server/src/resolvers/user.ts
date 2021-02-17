import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2';
import { includes } from 'lodash';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "../types";
import { CHANGE_PASSWORD_PREFIX, COOKIE_NAME } from "../constants";
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
    @Ctx() { req }: MyContext
  ): Promise<User | undefined> {
    // user not login
    if (! req.session.userId) {
      return undefined;
    }
    const user = await User.findOne({ id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('userInput') data: UserRegisterRequest,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateUserRegister(data);
    if (errors && errors.length > 0) {
      return {errors};
    }

    const hashPassword = await argon2.hash(data.password);
    try {
      const user = await User.create({username: data.username, email: data.email, password: hashPassword}).save();

      // log user in after successful register
      req.session.userId = user.id;
      return { user };
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      // user can login with either email or password      
      const user = await User.findOneOrFail(
        includes(data.username, '@') ? 
          {email: data.username}: 
          {username: data.username}
        );

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
    @Ctx() { redis } : MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ email });
    if (!user) {
      return true;
    }
    const token = uuidv4();
    await redis.set(`${CHANGE_PASSWORD_PREFIX}_${token}`, user.id, "ex", 60 * 60 * 1000)
    await sendResetPasswordEmail(user.username, user.email, token);
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() {req, redis} : MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(`${CHANGE_PASSWORD_PREFIX}_${token}`)
    if (userId) {
      const user = await User.findOne({ id: Number(userId) });
      if (!user) {
        return {
          errors: [{errorMsg: 'Invalid token'}]
        }
      }
      user.password = await argon2.hash(password);
      user.save();

      // delete token and log user in after success
      await redis.del(`${CHANGE_PASSWORD_PREFIX}_${token}`);
      req.session.userId = user.id;
      return {user};
    }
    return {
      errors: [{errorMsg: 'Invalid token'}]
    }
  }
}