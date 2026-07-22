import React from 'react'
import { ErrorPage } from './ErrorPage'
import { LoadingPage } from './LoadingPage'

export interface CombinableQuery {
  isPending: boolean
  isError: boolean
  refetch: () => void
  enabled?: boolean
}

export const useCombinedQueryState = (
  queries: CombinableQuery[],
): { isPending: boolean; isError: boolean; refetch: () => void } => {
  const active = queries.filter((query) => query.enabled !== false)

  return {
    isPending: active.some((query) => query.isPending),
    isError: active.some((query) => query.isError),
    refetch: () => active.forEach((query) => query.refetch()),
  }
}

interface QueryGateProps {
  queries: CombinableQuery[]
  children: React.ReactNode
}

export const QueryGate = ({ queries, children }: QueryGateProps): React.JSX.Element => {
  const { isPending, isError, refetch } = useCombinedQueryState(queries)

  return <>{isError ? <ErrorPage onRetry={refetch} /> : isPending ? <LoadingPage /> : children}</>
}
