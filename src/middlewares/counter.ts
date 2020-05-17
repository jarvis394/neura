import { MessageExtended } from '.'
import { client } from '../core/index'
import store from 'store'
import { GenerateCommand } from '../commands/generate'
import log from '../log'
import Guild from '../models/Guild'
import ErrorEmbed from '../models/ErrorEmbed'
import Channel from '../models/Channel'
import { AUTO_DEFAULT_INTERVAL } from '../config/constants'

export default async (
  message: MessageExtended,
  next: Function
): Promise<void> => {
  let count: number = 0
  if (!message.state) message.state = {}

  if (message.author.id !== client.user.id) {
    const [guildId, channelId] = [message.guild.id, message.channel.id]
    const id = guildId + '_' + channelId
    const guild = new Guild(guildId)
    const channel = new Channel(channelId, guildId)

    // Proceed if auto is disabled in guild or channel
    if (!guild.autoEnabled) return await next()
    if (!channel.autoEnabled) return await next()

    count = store.get(id)

    if (count) {
      store.set(id, count + 1)
      count++
    } else {
      store.set(id, 1)
      count = 1
    }

    if (count % (guild.autoInterval || AUTO_DEFAULT_INTERVAL) === 0) {
      try {
        await new GenerateCommand().exec({ message, args: [] })
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') log.error(e)
        else {
          log.error(e)
          new ErrorEmbed('Something wrong has happened: ' + e.message).send(message)
        }
      }
      store.set(id, 0)
    }
  }

  await next()
}
