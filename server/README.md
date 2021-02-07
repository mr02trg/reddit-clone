# Set up node with ts
* npm init -y
* yarn add -D @types/node typescript
* yarn add -D ts-node
* npx tsconfig.json
* yarn add -D nodemon
* `tsc -watch` | recompile changes to your ts file and output the compiled js to dist/ folder
* `nodemon ./dist/index.js` |  run the compiled js file when there are changes

# Set up ORM
* `yarn add @mikro-orm/core @mikro-orm/postgresql @mikro-orm/cli @mikro-orm/migrations pg`
* [Define your entities](https://mikro-orm.io/docs/defining-entities#classes-and-decorators)
  * entities/Post.ts
* Create MikroORM.init({...yourMikroConfig})
* [Set up CLI](https://mikro-orm.io/docs/4.3/installation#setting-up-the-commandline-tool)
* [Configure migration](https://mikro-orm.io/docs/migrations/#configuration)
* [Perform migration using CLI](https://mikro-orm.io/docs/migrations/#using-via-cli)

# Set up GraphQL server
* `yarn add express @types/express apollo-server-express graphql type-graphql`
* Set up express server
* Set up Apollo server

# Perform basic CRUD operation with GraphQL
* Pass MikroORM entity manager (em) to resolver via context
* Use @ObjectType/@Field decorator on your entity class so the GraphQL resolver understand it

# User Authentication
* User entity and User GraphQL
* `yarn add redis connect-redis express-session`
* `yarn add -D @types/redis @types/express-session @types/connect-redis`
* Manage user session --> To determine if the user is login
  * express-session - express middleware --> store user session data server-side, we will use redis as our session in-memory data storage in this project
  * redis / connect-redis - in memory database
    * Ensure redis is [installed](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) on your server
  * NOTE: you will need to set request.credentials: true in your graphQL playground settings in order to see the cookie being set
* [How this all works??](https://stackoverflow.com/questions/5522020/how-do-sessions-work-in-express-js-with-node-js#:~:text=Overview-,Express.,information%20stored%20on%20the%20server.)
  * after user login, `req.session.userId = user.id`. This will create a key-value record in redis that looks sth like this `abcd : {userId: 1}`
  * express-session will set the cookie in your browser `encrypt('abcd')`
  * when user send a request, the cookie is sent along `encrypt('abcd')`
  * decrypt the cookie to `abcd` using the secret we configured for redisStore
  * retrieve back the `userId` which is stored within redis

