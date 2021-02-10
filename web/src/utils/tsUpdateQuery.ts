import { Cache, QueryInput } from '@urql/exchange-graphcache';

export default function tsUpdateQuery<Result, QueryData>(
  cache: Cache,
  result: any,
  query: QueryInput,
  fn: (result: Result, data: QueryData) => QueryData
) {
  cache.updateQuery(query, data => fn(result, data as any) as any)
}