import { MessageExtended } from '.'
import { client } from '../core/index'
import store from 'store'
import { GenerateCommand } from '../commands/generate'
import log from '../log'

export default async (
  message: MessageExtended,
  next: Function
): Promise<void> => {
  let count: number = 0

  if (message.author.id !== client.user.id) {
    const id = message.guild.id + '_' + message.channel.id
    count = store.get(id)

    if (count) {
      store.set(id, count + 1)
      count++
    } else {
      store.set(id, 1)
      count = 1
    }

    if (count % 25 === 0) {
      try {
        await new GenerateCommand().exec({ message, args: [] })
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') log.error(e)
        else {
          log.error(e)
          message.reply('Something wrong has happened: ' + e.message)
        }
      }
      store.set(id, 0)
    }
  }

  if (!message.state) message.state = {}

  await next()
}
