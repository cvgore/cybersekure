import { db } from 'src/lib/db'

export const activities = () => {
  return db.activity.findMany()
}

export const Activity = {
  User: (_obj, { root }) => {
    return db.activity.findUnique({ where: { id: root?.id } }).User()
  },
}
