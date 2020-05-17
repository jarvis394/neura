import Command, { ExecOptions } from '../models/Command'
import { MessageEmbed } from 'discord.js'
import commands from '../core/commands'
import { PREFIX } from '../config/constants'
import Guild from '../models/Guild'

export class HelpCommand implements Command {
  name = 'help'
  description = {
    en: 'Shows the helping embed that will certainly help you',
    ru: 'Покажет страничку со спасительной информацией о том, как всё это использовать'
  }
  alias = ['h', 'hel', 'he', 'info', 'помощь', 'справка', 'about']

  async exec({ message }: ExecOptions) {
    const prefix = new Guild(message.guild.id).prefix || PREFIX
    const commandsHelp = commands.map(e => ({
      name: prefix + e.name,
      value: `**${e.description.en}**\n*Aliases: ${e.alias.map((i: string) => `\`${i}\``).join(', ')}*`
    }))
    const embed = new MessageEmbed()
      .setColor('#4a89ff')
      .setTitle('Help')
      .setDescription('This bot generates a random message using Markov chains')
      .addFields(commandsHelp)
      .setThumbnail('https://images.discordapp.net/avatars/704395625332211762/a68130df26ff41bf6dc3f2475f4509e2.png?size=512')
      .setTimestamp()
      .setFooter('Made by jarvis394#8343')

    return message.channel.send(embed)
  }
}