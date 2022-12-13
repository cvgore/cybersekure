import faktory from 'faktory-worker'

import { logger } from '$api/src/lib/logger'
import { pushActivity } from '$api/src/lib/tasks'

faktory.register('pushActivity', async (args) => {
  await pushActivity(args)
})

export default async ({ _args }) => {
  const worker = await faktory
    .work({
      url: process.env.FAKTORY_URL,
    })
    .catch((error) => {
      logger.error(`worker failed to start: ${error}`)
      process.exit(1)
    })

  worker.on('fail', ({ _job, error }) => {
    logger.error(`worker failed to start: ${error}`)
  })
}
