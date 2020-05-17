import Command, { ExecOptions } from '../models/Command'
import { BOT_DEV_ID } from '../config/constants'
import SuccessEmbed from 'src/models/SuccessEmbed'
import path from 'path'
import ErrorEmbed from 'src/models/ErrorEmbed'

export class ReloadCommand implements Command {
  name = 'help'
  description = {
    en: 'Shows the helping embed that will certainly help you',
    ru: 'Покажет страничку со спасительной информацией о том, как всё это использовать'
  }
  alias = ['r']

  async exec({ message, args }: ExecOptions) {
    const embed = new SuccessEmbed('Reloaded ' + args[0])

    if (message.author.id !== BOT_DEV_ID) return new ErrorEmbed('You are not a developer!').send(message)

    delete require.cache[require.resolve(path.resolve('.', args[0]))]
    return embed.send(message)
  }
}