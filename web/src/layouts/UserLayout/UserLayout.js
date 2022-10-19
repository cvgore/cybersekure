import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const UserLayout = ({ title, titleTo, buttonLabel, buttonTo, children }) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <nav className="rw-navbar">test</nav>
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default UserLayout
