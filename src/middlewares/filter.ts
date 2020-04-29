import { Message } from 'discord.js'
import { client } from '../core/index'

export default async (
  update: Message,
  next: Function
): Promise<void> => {
  const { content, author } = update

  if (author.id === client.user.id) return
  if (content === '' || !content) return
  if (author.bot) return

  await next()
}
