import { useAuth } from '@redwoodjs/auth'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const UserLayout = ({ title, titleTo, children }) => {
  const { logOut } = useAuth()

  const logout = async () => {
    if (confirm('You are about to logout. Are you sure?')) {
      await logOut()
      navigate(routes.login())
    }
  }

  return (
    <div className="rw-scaffold">
      <nav className="flex justify-between p-4">
        <div className="self-start">cybersekure</div>
        <div className="self-end">
          <div className="flex gap-x-2">
            <button href="#" className="rw-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        {title ? (
          <>
            <h1 className="rw-heading rw-heading-primary">
              {titleTo ? (
                <Link to={routes[titleTo]()} className="rw-link">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h1>
          </>
        ) : (
          <></>
        )}
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default UserLayout
