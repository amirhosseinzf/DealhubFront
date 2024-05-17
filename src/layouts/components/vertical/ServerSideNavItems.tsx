// ** React Imports
import { useEffect, useState } from 'react'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    axiosInterceptorInstance.get('/api/vertical-nav/data').then(response => {
      const menuArray = response.data

      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
