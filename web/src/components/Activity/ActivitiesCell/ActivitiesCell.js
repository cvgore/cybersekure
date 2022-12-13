import Activities from 'src/components/Activity/Activities'

export const QUERY = gql`
  query FindActivities {
    activities {
      id
      userId
      type
      payload
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">{'No activities yet. '}</div>
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ activities }) => {
  return <Activities activities={activities} />
}
