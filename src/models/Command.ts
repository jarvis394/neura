import { Message } from 'discord.js'
import { MessageExtended } from 'src/middlewares'

export interface ExecOptions {
  message: MessageExtended
  args: string[]
}

class Command {
  name: string
  args?: string[]
  description: {
    en: string
    ru: string
  }
  alias?: string[]

  constructor({ name = '', description = { en: '', ru: '' }, args = [] }: Command) {
    this.name = name
    this.args = args
    this.description = description
  }

  async exec({ message, args }: ExecOptions): Promise<void | Message> {
    return message.reply('Not implemented!\nArgs: ' + args.join(', '))
  }
}

export default Command