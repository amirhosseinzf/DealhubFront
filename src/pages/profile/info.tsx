import React from 'react'

type Props = {}

function Info({}: Props) {
  return <div>info</div>
}
Info.acl = {
  action: 'read',
  subject: 'profile-info'
}
export default Info
