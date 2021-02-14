import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mkoConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import redis from "redis";
import session from 'express-session';
import connectRedis from 'connect-redis';
require('dotenv').config();

import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mkoConfig);
  // run all migrations
  await orm.getMigrator().up();

  // set up express
  const app = express();

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax' //csrf
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET as string,
      resave: false,
    })
  )

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
    context: ({req, res}) => ({em: orm.em, req, res})
  });

  apolloServer.applyMiddleware({ 
    app, 
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    } 
  })

  // app.get('/', (_, res) => {
  //   res.send("Hello World!");
  // });
  app.listen(4000, () => console.log('app starts on localhost:4000'))
};

main().catch(err => console.log(err));
