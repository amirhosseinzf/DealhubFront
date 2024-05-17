import { UserRoles } from 'src/context/types'

/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (userRole: [UserRoles]) => {
  if (!userRole.length) return '/account/verify-email'
  for (let index = 0; index < userRole.length; index++) {
    const element = userRole[index]
    if (element.code === 'acl-page') return '/acl'
    if (element.code === 'CreateProfile') return '/profile/info'
  }

  return '/home'
}

export default getHomeRoute
