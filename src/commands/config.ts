import Command, { ExecOptions } from '../models/Command'
import { MessageEmbed, Message } from 'discord.js'
import Guild from '../models/Guild'
import Channel from '../models/Channel'
import ErrorEmbed from '../models/ErrorEmbed'
import SuccessEmbed from '../models/SuccessEmbed'

const getState = (s: string) => {
  const yes = ['да', '1', 'true', 'yes', 'enable']
  const no = ['нет', '0', 'false', 'no', 'disable']

  if (yes.includes(s)) return true
  else if (no.includes(s)) return false
  else throw new Error('Specify correct state')
}

export class ConfigCommand implements Command {
  name = 'config'
  description = {
    en: 'Configures the bot on your server',
    ru: 'Настраивает бота на сервере'
  }
  alias = ['c', 'con', 'settings', 'н', 'настройки', 'конфиг']
  guildParamsList = {
    prefix: this.changePrefix,
    auto: this.changeAutoEnabled,
    interval: this.changeAutoInterval,
    channel: this.configureChannel
  }
  channelParamsList = {
    auto: this.changeChannelAuto,
    disabled: this.changeChannelDisabled,
  }

  changeChannelAuto({ message, args }: ExecOptions) {
    const channel = new Channel(message.channel.id, message.guild.id)
    const newStateUnparsed = args[1]
    let newState: boolean

    if (newStateUnparsed) {
      try {
        newState = getState(newStateUnparsed)
      } catch (e) {
        return new ErrorEmbed(e).send(message)
      }
    } else newState = !channel.autoEnabled

    channel.setAutoEnabled(newState)
    return new SuccessEmbed(`Channel auto-sending state is **${newState}**\nNow messages ${newState ? 'will' : 'won\'t'} be sent there`).send(message)
  }

  changeChannelDisabled({ message, args }: ExecOptions) {
    const channel = new Channel(message.channel.id, message.guild.id)
    const newStateUnparsed = args[1]
    let newState: boolean

    if (newStateUnparsed) {
      try {
        newState = getState(newStateUnparsed)
      } catch (e) {
        return new ErrorEmbed(e).send(message)
      }
    } else newState = !channel.disabled

    channel.setDisabled(newState)
    return new SuccessEmbed(`Channel disabled state is **${newState}**\nNow bot ${newState ? 'will' : 'won\'t'} be disabled there`).send(message)
  }

  changePrefix({ message, args }: ExecOptions) {
    const guild = new Guild(message.guild.id)
    const newPrefix = args[1]

    if (!newPrefix) return new ErrorEmbed('Enter prefix').send(message)
    if (newPrefix.length < 1) return new ErrorEmbed('Prefix must be length of >=1').send(message)
    if (newPrefix.length > 5) return new ErrorEmbed('Prefix must be length of <=5').send(message)
    if (newPrefix === guild.prefix) return new ErrorEmbed('Prefix must not be equal to the previous prefix (`' + guild.prefix + '`)').send(message)

    guild.setPrefix(newPrefix)
    return new SuccessEmbed('New prefix is **' + newPrefix + '**').send(message)
  }

  changeAutoEnabled({ message, args }: ExecOptions) {
    const guild = new Guild(message.guild.id)
    const newStateUnparsed = args[1]
    let newState: boolean

    if (newStateUnparsed) {
      try {
        newState = getState(newStateUnparsed)
      } catch (e) {
        return new ErrorEmbed(e).send(message)
      }
    } else newState = !guild.autoEnabled

    guild.setAutoEnabled(newState)
    return new SuccessEmbed(`Guild auto-sending state is **${newState}**\nNow messages ${newState ? 'will' : 'won\'t'} be sent there`).send(message)
  }

  changeAutoInterval({ message, args }: ExecOptions) {
    const guild = new Guild(message.guild.id)
    const newInterval = Number(args[1])

    if (isNaN(newInterval)) return new ErrorEmbed('Interval must be a number').send(message)
    if (newInterval < 5) return new ErrorEmbed('Interval must not be lower than 5').send(message)
    if (newInterval > 100) return new ErrorEmbed('Interval must not be higher than 100').send(message)
    if (newInterval === guild.autoInterval) return new ErrorEmbed('Interval must not be equal to the previous interval (`' + guild.autoInterval + '`)').send(message)

    guild.setAutoInterval(newInterval)
    return new SuccessEmbed('New interval is **' + newInterval + '**').send(message)
  }

  configureChannel({ message, args }: ExecOptions) {
    const guild = new Guild(message.guild.id)
    const channel = new Channel(message.channel.id, message.guild.id)
    const embed = new MessageEmbed()
      .setColor('#4a89ff')
      .setTitle('Config')
      .setDescription(`Configure the bot on the channel\nUse \`${guild.prefix}c channel <field> (value)\` to change the parameter`)
      .addFields([
        {
          name: 'Disabled status',
          value: [
            `\`disabled <state>\` - **${channel.disabled ? 'Yes' : 'No'}**`,
            'Disables bot in channel completely',
          ].join('\n')
        },
        {
          name: 'Auto-sending enabled',
          value: [
            `\`auto (state)\` - **${channel.autoEnabled ? 'Yes' : 'No'}**`,
            'Should bot send random messages after **n**th message in this channel',
          ].join('\n')
        }
      ])
      .setTimestamp()
      .setFooter('Made by jarvis394#8343')

    if (!args[1]) return message.channel.send(embed)
    else if (this.channelParamsList[args[1]]) return this.channelParamsList[args[1]]({ message, args })
    else return this.sendList(message, true)
  }

  main({ message }: ExecOptions) {
    const guild = new Guild(message.guild.id)
    const channel = new Channel(message.channel.id, message.guild.id)
    const embed = new MessageEmbed()
      .setColor('#4a89ff')
      .setTitle('Config')
      .setDescription(`Configure the bot on the server\nUse \`${guild.prefix}c <field> (value)\` to change the parameter`)
      .addFields([
        {
          name: 'Prefix',
          value: [
            `\`prefix <string>\` - **${guild.prefix}**`,
            'Prefix for neura\'s commands',
          ].join('\n')
        },
        {
          name: 'Auto-sending enabled',
          value: [
            `\`auto (state)\` - **${guild.autoEnabled ? 'Yes' : 'No'}**`,
            'Should bot send random messages after **n**th message',
          ].join('\n')
        }
      ])
      .setTimestamp()
      .setFooter('Made by jarvis394#8343')

    if (guild.autoEnabled) embed.addField('Auto-sending interval', [
      `\`interval <number>\` - After **${guild.autoInterval}** messages`,
      'Interval for the auto-sending messages',
    ].join('\n'))

    return message.channel.send(embed)
  }

  sendList(message: Message, forChannel: boolean) {
    const embed = new ErrorEmbed('Specify correct parameter: one of\n\n‣ ' + Object.keys(forChannel ? this.channelParamsList : this.guildParamsList).join('\n‣ '))
    return embed.send(message)
  }

  async exec({ message, args }: ExecOptions) {
    if (!args[0]) return this.main({ message, args })
    else if (this.guildParamsList[args[0]]) return this.guildParamsList[args[0]]({ message, args })
    else return this.sendList(message, false)
  }
}