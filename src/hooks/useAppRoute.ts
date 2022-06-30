import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const useAppRouter = () => {
  const location = useLocation()
  const history = useHistory()

  const query = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const getQuery = useCallback((queryId: string) => query.get(queryId), [query])

  const generateQuery = useCallback((dataQuery: Record<string, any>) => {
    const newQuery = new URLSearchParams()
    for (const key in dataQuery) {
      newQuery.set(key, dataQuery[key])
    }
    return newQuery.toString()
  }, [])

  const appRoute = useMemo(() => `/app/${appId}`, [])

  const pushHistory = useCallback(
    (url: string) => history.push(`${appRoute}${url}`),
    [appRoute, history],
  )

  return { getQuery, generateQuery, pushHistory, appRoute }
}
