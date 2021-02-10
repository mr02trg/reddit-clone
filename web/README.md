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

* urql Custom update
  * urql will cache your response and will not make another graphql call
    * In this example, the `me` query is not called, thus navbar is not updated after user login/register
  * [manual update with `cache.updateQuery`](https://formidable.com/open-source/urql/docs/graphcache/custom-updates/)

* Fragment 
  * Better for maintainence your grapql query

## Set up nextjs url server side rendering
* [Set up nextjs urql ssr](https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#nextjs)
* Create a HOC that allow us to specify which page will be SSR
  * The idea here is to SSR a page with dynamic data loaded and SEO
* Since SSR will put more load on our server
  * We can improve the app by specifying which graphql query/mutation (some query that doesn't make sense to do ssr - no SEO benefit)
  * You want to pause and execute on the client side, even though the page itself will be executed on the server side