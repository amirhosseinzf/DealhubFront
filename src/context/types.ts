export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
  captchaResponse?: string
  rememberMe?: boolean
}
export type RegisterParams = {
  username: string
  emailAddress: string
  password: string
  repeatPassword: string
}
export type UserRoles = {
  code: string
  displayName: string
  name: string
  requiresElevation: boolean
}
export type UserDataType = {
  globalId: string
  userRoles: [UserRoles]
  email: string
  normalizedUsername: string
  displayName: string
  username: string
  password: string
  isEmailVerified: boolean
  status: number
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
