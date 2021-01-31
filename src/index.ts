import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mkoConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mkoConfig);
  // run all migrations
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, {title: 'my first post'});
  // await orm.em.persistAndFlush(post);
  const posts = await orm.em.find(Post, {});
  console.log(posts);

  // set up express
  const app = express();

  // set up apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver
      ],
      validate: false
    }),
    // object that can be accessed by all your resolver
    context: () => ({em: orm.em})
  });

  apolloServer.applyMiddleware({ app })

  // app.get('/', (_, res) => {
  //   res.send("Hello World!");
  // });
  app.listen(4000, () => console.log('app starts on localhost:4000'))
};

main().catch(err => console.log(err));
