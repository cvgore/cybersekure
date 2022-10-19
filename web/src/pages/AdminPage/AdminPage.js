import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <div className="flex gap-x-2">
        <Link to={routes.changePassword()} className="rw-button">
          Change Password
        </Link>
      </div>
    </>
  )
}

export default AdminPage
