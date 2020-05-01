import Discord from 'discord.js'

export default class SuccessEmbed {
  message: string
  constructor(message: string) { this.message = message }
  send(msg: Discord.Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Success')
      .setColor('#33CC6A')
      .setDescription(this.message)
      .setFooter(msg.content)
      .setTimestamp()
    msg.channel.send(embed)
  }
}