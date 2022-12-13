import faktory from 'faktory-worker'

export async function recordActivity(type, payload, userId) {
  if (typeof userId === 'undefined') {
    userId = context.currentUser?.id
  }

  if (!userId) {
    throw new Error('recordActivity no user context')
  }

  const client = await faktory.connect()
  await client.job('pushActivity', { userId, type, payload }).push()
  await client.close()
}

export async function dispatchTask(taskName, data) {
  const client = await faktory.connect()
  await client.job(taskName, data).push()
  await client.close()
}
