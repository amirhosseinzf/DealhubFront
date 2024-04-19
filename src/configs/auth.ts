export default {
  meEndpoint: 'https://localhost/api/Auth/AccountInfo',
  loginEndpoint: 'https://localhost/api/auth/login',
  registerEndpoint: 'https://localhost/api/Account/Register',
  sendEmailVerfiyEndpoint: 'https://localhost/api/Account/SendEmailVerification',
  verifyEmailEndpoint: 'https://localhost/api/Account/VerifyEmail',
  logoutEndpoint: 'https://localhost/api/auth/logout',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
