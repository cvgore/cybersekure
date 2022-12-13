import { useState } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const AdminPage = () => {
  const [locked, setLocked] = useState(false)

  setInterval(() => {
    const time = Math.round(+new Date() / 1000)
    if (time % 12 === 0) {
      setLocked(!locked)
    }
  }, 1000)

  function openFile(_target) {
    //
  }

  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <div className="flex gap-x-2">
        <Link to={routes.changePassword()} className="rw-button">
          Change Password
        </Link>
        <Link to={routes.activities()} className="rw-button">
          Activity log
        </Link>
        <Link to={routes.activate()} className="rw-button">
          UNLOCK FULL
        </Link>
      </div>
      <h5 className="py-4">Special features</h5>
      <div className="flex gap-x-2">
        {!locked && (
          <input type="file" onChange={(ev) => openFile(ev.target)}></input>
        )}
        {locked && <b>Please unlock full version</b>}
      </div>
    </>
  )
}

export default AdminPage
