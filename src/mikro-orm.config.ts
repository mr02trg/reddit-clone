import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from 'path';
require('dotenv').config();

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [
    Post
  ],
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  type: 'postgresql',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];