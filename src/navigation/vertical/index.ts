// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Test Page',
      path: '/second-page',
      icon: 'mdi:email-outline'
    },
    {
      title: 'Invoice',
      path: '/invoice/list',
      icon: 'mdi:paper-outline'
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
