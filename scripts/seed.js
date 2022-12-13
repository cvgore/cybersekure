import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/api'

export default async () => {
  try {
    const users = [
      { username: 'SYSTEM', password: '' },
      { username: 'ADMIN', password: 'Admin1' },
    ]

    for (const user of users) {
      const [hashedPassword, salt] = hashPassword(user.password)
      await db.user.create({
        data: {
          username: user.username,
          hashedPassword,
          salt,
          roles: 'admin',
        },
      })
    }

    const settings = {
      saveUserActivites: true,
      maxFailedLoginAttempts: 5,
      failedLoginLockoutTime: 5 * 60,
      sessionTime: 10 * 60,
      activationKey: null,
    }

    Object.entries(settings).forEach(async ([key, value]) => {
      await db.setting.create({
        data: { key, value: JSON.stringify(value) },
      })
    })
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
