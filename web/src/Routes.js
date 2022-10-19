// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'

import AdminLayout from './layouts/AdminLayout/AdminLayout'
import UserLayout from './layouts/UserLayout/UserLayout'

const Routes = () => {
  return (
    <Router>
      <Private unauthenticated="login" roles="admin">
        <Set wrap={AdminLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </Set>
        <Set wrap={AdminLayout} title="Admin">
          <Route path="/admin" page={AdminPage} name="admin" />
        </Set>
      </Private>
      <Private unauthenticated="login" roles="user">
        <Set wrap={UserLayout} title="Account" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/me" page={MePage} name="me" />
        </Set>
      </Private>
      <Private unauthenticated="login">
        <Route path="/change-password" page={ChangePasswordPage} name="changePassword" />
      </Private>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
