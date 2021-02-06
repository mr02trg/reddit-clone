# Example nextjs app with [chakra-ui](https://github.com/chakra-ui/chakra-ui)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
# or
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## NextJS
* Whatever component you create inside `pages/`, it is considered as a route

## Set up urql 
* GraphQL client library
  * [Set up urql](https://formidable.com/open-source/urql/docs/basics/getting-started/#react--preact)
  * [Set up graph codegen](https://graphql-code-generator.com/docs/getting-started/installation)
    * `yarn graphql-codegen init`
    * `yarn add -D @graphql-codegen/typescript-urql`
    * This will generate `codegen.yml` file
    * This will also add a new script in your package.json, which allows you to genereate graphql type based on your graphql schema at `generated/graphql.tsx`
