import Preview from 'src/views/manageProfile/preview/Preview'
import { useSearchParams } from 'next/navigation'

const ProfilePreview = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return <Preview id={id} />
}

ProfilePreview.acl = {
  action: 'read',
  subject: 'manage-profiles'
}
export default ProfilePreview
