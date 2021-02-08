import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';

import theme from '../theme'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

function tsUpdateQuery<Result, QueryData>(
  cache: Cache,
  result: any,
  query: QueryInput,
  fn: (result: Result, data: QueryData) => QueryData
) {
  cache.updateQuery(query, data => fn(result, data as any) as any)
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  exchanges: [dedupExchange ,cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          tsUpdateQuery<LoginMutation, MeQuery>(
            cache,
            _result,
            {query: MeDocument},
            (loginResult, data) => {
              if (loginResult.login?.errors) {
                return data;
              } else if (loginResult.login?.user) {
                return {me: loginResult.login?.user}
              }
            })
        },
        register: (_result, args, cache, info) => {
          tsUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            _result,
            {query: MeDocument},
            (loginResult, data) => {
              if (loginResult.register?.errors) {
                return data;
              } else if (loginResult.register?.user) {
                return {me: loginResult.register?.user}
              }
            })
        },
        logout: (_result, args, cache, info) => {
          tsUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            _result,
            {query: MeDocument},
            () => {
              return {me: null};
            }
          )
        }
      }
    }
  }), fetchExchange]
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>

  )
}

export default MyApp
