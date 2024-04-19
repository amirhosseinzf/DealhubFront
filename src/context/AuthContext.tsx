// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(false)

        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            debugger
            setLoading(false)
            setUser({ ...response.data })
          })
          .catch(() => {
            debugger
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    debugger

    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        debugger
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, 'asdfadfafafasdfsadfasfasdfasfasdf') //response.data.accessToken
          : null
        const returnUrl = router.query.returnUrl

        setUser({ ...response.data.accountInfo })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.accountInfo)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        debugger
        if (errorCallback) errorCallback(err)
      })
  }
  const handleRegister = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    debugger

    axios
      .post(authConfig.registerEndpoint, params)
      .then(async response => {
        debugger

        // params.rememberMe
        //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, 'asdfadfafafasdfsadfasfasdfasfasdf') //response.data.accessToken
        //   : null
        // const returnUrl = router.query.returnUrl

        // setUser({ ...response.data.accountInfo })
        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.accountInfo)) : null

        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        // router.replace(redirectURL as string)
      })

      .catch(err => {
        debugger
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = async (errorCallback?: ErrCallbackType) => {
    await axios
      .post(authConfig.logoutEndpoint)
      .then(() => {
        setUser(null)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        router.push('/login')
      })
      .catch(err => {
        debugger
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
