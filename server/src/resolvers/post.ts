import { Post } from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {

  // {
  //   posts {
  //     createdAt
  //     updatedAt
  //     title
  //   }
  // }
  @Query(() => [Post])
  // GraphQL resolver function has to return either a value or a promise that resolves to that value
  posts(): Promise<Post[]> {
    return Post.find({});
  }

  // {
  //   post(id:3) {
  //     createdAt
  //     updatedAt
  //     title
  //   }
  // }
  @Query(() => Post, {nullable: true})
  post(
    @Arg('id', () => Int) id: number,
  ): Promise<Post | undefined> {
    return Post.findOne({ id });
  }

  // mutation{
  //   createPost(title: "this is post3") {
  //     id
  //     createdAt
  //     updatedAt
  //     title
  //   }
  // }
  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
  ): Promise<Post> {
    return Post.create({ title }).save();;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, {nullable: true}) title: string,
  ): Promise<Post | undefined> {
    const post = await Post.findOne({id});
    if (! post) {
      return undefined;
    }

    if (title) {
      await Post.update({id}, {title})
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
  ): Promise<boolean> {
    await Post.delete({ id })
    return true;
  }
}