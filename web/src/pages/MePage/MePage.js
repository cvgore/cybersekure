import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const MePage = () => {
  return (
    <>
      <MetaTags title="Me" description="Me page" />

      <div className="flex gap-x-2">
        <Link to={routes.changePassword()} className="rw-button">
          Change Password
        </Link>
      </div>
    </>
  )
}

export default MePage
