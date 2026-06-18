import { useEffect } from 'react'

import { client } from '~/shared/api/graphql'
import { ME_QUERY } from '~/shared/auth/api/me'
import { useAuthStore } from '~/shared/auth/auth.store'

let initAttempted = false

export const useInitAuth = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (initAttempted) return
    initAttempted = true

    const token = useAuthStore.getState().token

    if (!token) {
      setLoading(false)
      return
    }

    const init = async () => {
      try {
        const meResult = await client.query(ME_QUERY, {}).toPromise()

        if (meResult.data?.me) {
          setUser(meResult.data.me)
        } else {
          logout()
        }
      } catch {
        logout()
      }
    }

    void init()
  }, [setLoading, logout, setUser])
}
