import express from 'express'
import log from '../log'

export const app = express()
export const shouldStart = process.env.ENABLE_WEB === 'true'

app.get('/', (_, res) => res.json(process.uptime()))

app.get('/invite', (_, res) => {
  res.redirect('https://discord.com/oauth2/authorize?client_id=704395625332211762&permissions=8&scope=bot')
})

if (shouldStart) {
  app.listen(process.env.PORT, () => {
    log.info('Started web listening on port ' + process.env.PORT, { service: 'web' })
  })
} else {
  log.info('Web server not starting due to the environment', { service: 'web' })
}