import React from 'react'

type Props = {}

const profile = (props: Props) => {
  return <div>profile</div>
}
profile.acl = {
  action: 'read',
  subject: 'manage-profiles'
}
export default profile
