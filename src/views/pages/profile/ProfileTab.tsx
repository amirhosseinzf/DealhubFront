// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// import toast from 'react-hot-toast'
import MainEditProfile from 'src/views/pages/profile/MainEditProfile'
import MainActiveProfile from 'src/views/pages/profile/MainActiveProfile'
import { ProfileContext } from 'src/context/ProfileContext'

const ProfileTab = () => {
  const { loadingForm, activeProfileForm, pendingProfileForm } = useContext(ProfileContext)

  // ** States
  const [tabBaseInfo, settabBaseInfo] = useState('1')

  const tabHandleChange = (event: React.SyntheticEvent, newValue: string) => {
    settabBaseInfo(newValue)
  }
  useEffect(() => {
    if (loadingForm == false && activeProfileForm != null) {
      settabBaseInfo('2')
    }
  }, [loadingForm])

  return (
    <>
      {loadingForm && <div>Loading ...</div>}
      {!loadingForm && (
        <>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabBaseInfo}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={tabHandleChange} aria-label='lab API tabs example'>
                  <Tab label='Active Profile' value='2' />
                  <Tab label='Edit profile' value='1' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <MainEditProfile serverData={pendingProfileForm} />
              </TabPanel>
              <TabPanel value='2'>
                <MainActiveProfile serverData={activeProfileForm} />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  )
}

export default ProfileTab
