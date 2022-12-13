import { timeTag, truncate } from 'src/lib/formatters'

const ActivitiesList = ({ activities }) => {
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Type</th>
            <th>Payload</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{truncate(activity.id)}</td>
              <td>{truncate(activity.userId)}</td>
              <td>{truncate(activity.type)}</td>
              <td>{truncate(activity.payload)}</td>
              <td>{timeTag(activity.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivitiesList
