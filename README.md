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