import { ProfileProvider } from 'src/context/ProfileContext'
import ProfileTab from 'src/views/pages/profile/ProfileTab'

const Info = () => {
  return (
    <>
      <ProfileProvider>
        <ProfileTab />
      </ProfileProvider>
    </>
  )
}
Info.acl = {
  action: 'read',
  subject: 'profile-info'
}
export default Info
