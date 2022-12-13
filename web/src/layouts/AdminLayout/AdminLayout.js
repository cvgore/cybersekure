import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes, back } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const AdminLayout = ({ title, titleTo, buttonLabel, buttonTo, children }) => {
  const { logOut, hasRole } = useAuth()

  if (!hasRole('admin')) {
    return back()
  }

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
            <Link to={routes.admin()} className="rw-button">
              Admin
            </Link>
            <Link to={routes.users()} className="rw-button">
              Users
            </Link>
            <Link to={routes.settings()} className="rw-button">
              Settings
            </Link>
            <Link to={routes.activities()} className="rw-button">
              Activity log
            </Link>
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
            {buttonLabel && buttonTo && (
              <Link
                to={routes[buttonTo]()}
                className="rw-button rw-button-green"
              >
                <div className="rw-button-icon">+</div> {buttonLabel}
              </Link>
            )}
          </>
        ) : (
          <></>
        )}
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default AdminLayout
