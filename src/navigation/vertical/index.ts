// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'verify Email',
      path: '/account/verify-email',
      icon: 'mdi:lock-outline',
      action: 'read',
      subject: 'verify-email'
    },
    {
      title: 'Profile',
      path: '/profile/info',
      icon: 'mdi:user-outline',
      action: 'read',
      subject: 'profile-info'
    },
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline'

      // auth: false
    },
    {
      title: 'Test Page',
      path: '/second-page',
      icon: 'mdi:email-outline'
    },
    {
      title: 'Invoice',
      path: '/invoice/list',
      icon: 'mdi:paper-outline',
      action: 'manage',
      subject: 'UserManagment'
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'access Manage',
      icon: 'mdi:shield-outline'
    }
  ]
}

export default navigation
