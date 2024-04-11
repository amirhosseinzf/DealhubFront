// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'خانه',
      path: '/home',
      icon: 'mdi:home-outline'
    },
    {
      title: 'صفحه تستی',
      path: '/second-page',
      icon: 'mdi:email-outline'
    },
    {
      title: 'فاکتور',
      path: '/invoice/list',
      icon: 'mdi:paper-outline'
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'کنترل دسترسی',
      icon: 'mdi:shield-outline'
    }
  ]
}

export default navigation
