import { hashQueryKey, notifyManager, Query, QueryCache } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'wagmi'

import type { GlobalErrorDispatch, GlobalErrorState } from './GlobalErrorProvider'
import { useSyncExternalStore } from './useSyncExternalStore'

const SLOW_THRESHOLD = 5000

const getSlowQueries = (queryCache: QueryCache, renderedAt: number) => {
  const queries = queryCache.getAll()
  const slowQueries: any[] = []

  queries.forEach((query) => {
    const { dataUpdatedAt } = query.state
    const elapsedTime = Date.now() - Math.max(dataUpdatedAt, renderedAt)

    if (
      elapsedTime > SLOW_THRESHOLD &&
      query.state.status === 'loading' &&
      query.getObserversCount() > 0
    ) {
      slowQueries.push(query)
    }
  })

  return slowQueries.length
}


const slowQueriesHashKey = hashQueryKey(['slowQueriesKeyPlaceholder'])

export const useHasSlowQueries = (state: GlobalErrorState, dispatch: GlobalErrorDispatch) => {
  const { t } = useTranslation('common')

  const queryClient = useQueryClient()
  const queryCache = queryClient.getQueryCache()

  const renderedAt = useMemo(() => Date.now(), [])

  const slowQueries = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        return queryCache.subscribe(() => {
          notifyManager.batchCalls(onStoreChange)
          setTimeout(() => {
            notifyManager.batchCalls(onStoreChange)
          }, SLOW_THRESHOLD)
        })
      },
      [queryCache],
    ),
    () => getSlowQueries(queryCache, renderedAt),
    () => getSlowQueries(queryCache, renderedAt),
  )

    useEffect(() => {
    const stateError = state.errors[slowQueriesHashKey]
    if (slowQueries > 0 && !stateError) {
      console.log('setting error')
      console.log(slowQueries)
      dispatch({
        type: 'SET_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
          title: t('errors.networkLatency.title'),
          message: t('errors.networkLatency.message'),
          type: 'ENSJSNetworkLatencyError',
          priority: 1,
        },
      })
    } else if (stateError) {
      console.log('clearing error')
      dispatch({
        type: 'CLEAR_ERROR',
        payload: {
          key: ['slowQueriesKeyPlaceholder'],
        },
      })
    }
  }, [slowQueries])
}
