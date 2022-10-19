import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/api'

export default async () => {
  try {
    // If using dbAuth and seeding users, you'll need to add a `hashedPassword`
    // and associated `salt` to their record. Here's how to create them using
    // the same algorithm that dbAuth uses internally:
    //
    //   import { hashPassword } from '@redwoodjs/api'
    //
    const users = [{ username: 'ADMIN', password: 'Admin1' }]

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
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
