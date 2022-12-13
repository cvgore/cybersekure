import { db } from './db'

export const pushActivity = async ({ type, userId, payload }) => {
  await db.activity.create({
    data: {
      type,
      payload: JSON.stringify(payload),
      User: {
        connect: { id: userId },
      },
      createdAt: new Date(),
    },
  })
}
