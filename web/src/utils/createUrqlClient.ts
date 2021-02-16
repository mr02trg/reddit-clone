import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation, ChangePasswordMutation } from "../generated/graphql";
import tsUpdateQuery from "./tsUpdateQuery";


const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
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
          },
          changePassword: (_result, args, cache, info) => {
            tsUpdateQuery<ChangePasswordMutation, MeQuery>(
              cache,
              _result,
              {query: MeDocument},
              (changePasswordResult, data) => {
                if (changePasswordResult.changePassword.errors) {
                  return data;
                } else if (changePasswordResult.changePassword.user) {
                  return {me: changePasswordResult.changePassword.user};
                }
              }
            )
          }
        }
      }
    }),
    ssrExchange,
    fetchExchange]
})

export default createUrqlClient;