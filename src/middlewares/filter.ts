import { Message } from 'discord.js'
import { client } from '../core/index'
import Channel from '../models/Channel'

export default async (
  message: Message,
  next: Function
): Promise<void> => {
  const { content, author } = message
  const isBotDisabledInChannel = (new Channel(message.channel.id, message.guild.id)).disabled
  const canWrite = message.guild.me.hasPermission('SEND_MESSAGES')

  if (!canWrite) return
  if (isBotDisabledInChannel) return
  if (author.id === client.user.id) return
  if (content === '' || !content) return
  if (author.bot) return

  await next()
}
