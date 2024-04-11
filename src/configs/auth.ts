export default {
  meEndpoint: 'https://localhost/api/Auth/AccountInfo',
  loginEndpoint: 'https://localhost/api/auth/login',
  logoutEndpoint: 'https://localhost/api/auth/logout',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
