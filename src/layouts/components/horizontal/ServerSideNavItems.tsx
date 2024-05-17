// ** React Imports
import { useEffect, useState } from 'react'

// ** Type Import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<HorizontalNavItemsType>([])

  useEffect(() => {
    axiosInterceptorInstance.get('/api/horizontal-nav/data').then(response => {
      const menuArray = response.data

      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
