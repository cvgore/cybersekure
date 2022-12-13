import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Setting/SettingsCell'
import { truncate } from 'src/lib/formatters'

const SettingsList = ({ settings }) => {
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting.key}>
              <td>{truncate(setting.key)}</td>
              <td>{truncate(setting.value)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.editSetting({ id: setting.key })}
                    title={'Edit setting ' + setting.key}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SettingsList
