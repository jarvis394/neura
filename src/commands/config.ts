import Command, { ExecOptions } from '../models/Command'
import { MessageEmbed } from 'discord.js'
import { PREFIX } from '../config/constants'

export class HelpCommand implements Command {
  name = 'help'
  description = {
    en: 'Configures the bot on your server',
    ru: 'Настраивает бота на сервере'
  }
  alias = ['c', 'con', 'settings', 'н', 'настройки', 'конфиг']

  exec({ message }: ExecOptions) {
    const embed = new MessageEmbed()
      .setColor('#4a89ff')
      .setTitle('Config')
      .setDescription('Configure the bot on the server')
      .setTimestamp()
      .setFooter('Made by jarvis394#8343')

    return message.channel.send(embed)
  }
}