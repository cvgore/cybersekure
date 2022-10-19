import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { UserPasswordForm } from 'src/components/User/UserPasswordForm/UserPasswordForm'

const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation UpdateUserPasswordMutation(
    $id: Int!
    $input: UpdateUserPasswordInput!
  ) {
    updateUserPassword(id: $id, input: $input)
  }
`

export const ChangePasswordPage = ({ user }) => {
  const { reauthenticate } = useAuth()
  const [updateUserPassword, { loading, error }] = useMutation(
    UPDATE_USER_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        reauthenticate().then(() => {
          navigate(routes.me())
          toast.success('Password updated successfully')
        })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateUserPassword({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Change password</h2>
      </header>
      <div className="rw-segment-main">
        <UserPasswordForm
          user={user}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ChangePasswordPage
