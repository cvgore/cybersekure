import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/User/UsersCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

const DELETE_USER_MUTATION = gql`
  mutation DeleteUserMutation($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const BLOCK_USER_MUTATION = gql`
  mutation BlockUserMutation($id: Int!) {
    blockUser(id: $id)
  }
`

const ENABLE_OTP_MUTATION = gql`
  mutation EnableOneTimePasswordRequirementMutation($id: Int!) {
    enableOneTimePasswordRequirement(id: $id)
  }
`

const DISABLE_OTP_MUTATION = gql`
  mutation DisableOneTimePasswordRequirementMutation($id: Int!) {
    disableOneTimePasswordRequirement(id: $id)
  }
`

const UsersList = ({ users }) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const [blockUser] = useMutation(BLOCK_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User blocked')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const [enableOtp] = useMutation(ENABLE_OTP_MUTATION, {
    onCompleted: () => {
      toast.success('User OTP enabled')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const [disableOtp] = useMutation(DISABLE_OTP_MUTATION, {
    onCompleted: () => {
      toast.success('User OTP disabled')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete user ' + id + '?')) {
      deleteUser({ variables: { id } })
    }
  }

  const onBlockClick = (id) => {
    if (confirm('Are you sure you want to block user ' + id + '?')) {
      blockUser({ variables: { id } })
    }
  }

  const onEnableOtpClick = (id) => {
    if (confirm('Are you sure you want to enable OTP for user ' + id + '?')) {
      enableOtp({ variables: { id } })
    }
  }

  const onDisableOtpClick = (id) => {
    if (confirm('Are you sure you want to disable OTP for user ' + id + '?')) {
      disableOtp({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Roles</th>
            <th>Reset token expires at</th>
            <th>Expire password period</th>
            <th>Expire password start date</th>
            <th>Force new password on login</th>
            <th>Password complexity rules</th>
            <th>Expires at</th>
            <th>Deleted at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{truncate(user.id)}</td>
              <td>{truncate(user.username)}</td>
              <td>{truncate(user.roles)}</td>
              <td>{timeTag(user.resetTokenExpiresAt)}</td>
              <td>{truncate(user.expirePasswordPeriod)}</td>
              <td>{timeTag(user.expirePasswordStartDate)}</td>
              <td>{checkboxInputTag(user.forceNewPasswordOnLogin)}</td>
              <td>{truncate(user.passwordComplexityRules)}</td>
              <td>{timeTag(user.expiresAt)}</td>
              <td>{timeTag(user.deletedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.user({ id: user.id })}
                    title={'Show user ' + user.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUser({ id: user.id })}
                    title={'Edit user ' + user.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  {user.oneTimePasswordEnabled ? (
                    <>
                      <button
                        type="button"
                        title={
                          'Disable one time password requirement for user ' +
                          user.id
                        }
                        className="rw-button rw-button-small"
                        onClick={() => onDisableOtpClick(user.id)}
                      >
                        OTP Disable
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        title={
                          'Enable one time password requirement for user ' +
                          user.id
                        }
                        className="rw-button rw-button-small"
                        onClick={() => onEnableOtpClick(user.id)}
                      >
                        OTP Enable
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    title={'Block user ' + user.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onBlockClick(user.id)}
                  >
                    Block
                  </button>
                  <button
                    type="button"
                    title={'Delete user ' + user.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(user.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList
