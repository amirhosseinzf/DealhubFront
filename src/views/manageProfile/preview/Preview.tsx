import React from 'react'

type Props = {
  id: string | null
}

function Preview({ id }: Props) {
  return <div>Preview{id}</div>
}

export default Preview
