import Discord from 'discord.js'

export default class ErrorEmbed {
  message: string
  constructor(message: string) { this.message = message }
  send(msg: Discord.Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setColor('#E64B41')
      .setDescription(this.message)
      .setFooter(msg.content)
      .setTimestamp()
    msg.channel.send(embed)
  }
}