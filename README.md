# Set up node with ts
* npm init -y
* yarn add -D @types/node typescript
* yarn add -D ts-node
* npx tsconfig.json
* yarn add -D nodemon
* `tsc -watch` | recompile changes to your ts file and output the compiled js to dist/ folder
* `nodemon ./dist/index.js` |  run the compiled js file when there are changes
