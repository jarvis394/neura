import express from 'express'
import log from '../log'

export const app = express()
export const shouldStart = process.env.ENABLE_WEB === 'true'

if (shouldStart) {
  app.listen(process.env.PORT, () => {
    log.info('Started web listening on port ' + process.env.PORT, { service: 'web' })
  })
} else {
  log.info('Web server not starting due to the environment', { service: 'web' })
}
