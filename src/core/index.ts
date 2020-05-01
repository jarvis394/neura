import Discord from 'discord.js'
import dotenv from 'dotenv'
import log from '../log'
import getDefaultChannel from '../utils/getDefaultChannel'
import { PREFIX } from '../config/constants'

// Start Python backend
import './startPython'

// Start web server
import './web'

// Initialize all environment variables to appear in the process.env
dotenv.config()

export const client = new Discord.Client()

client.on('ready', () => {
  const activityName = `on messages | ${PREFIX}help`
  client.user.setPresence({
    activity: {
      type: 'WATCHING',
      name: activityName
    },
    status: 'online'
  })
  log.info(`Logged in as ${client.user.tag}!`)

  require('../middlewares')
})

client.on('error', (err) => log.error(err))

client.on('guildCreate', async (guild) => {
  const description = [
    'I\'m **neura**, and I create some random stuff generated with a power of Markov chains!',
    `I take the message history and generate an unique sentence, try it out - \`${PREFIX}g\``
  ]
  const embed = new Discord.MessageEmbed()
    .setColor('#4a89ff')
    .setTitle('Joined ' + guild.name)
    .setDescription(description.join('\n'))
    .addFields(
      { name: 'Commands', value: `See \`${PREFIX}help\` for the information about bot\'s commands` },
      { name: 'Support', value: `https://discord.gg/3YAZc7r` },
      { name: 'GitHub', value: `https://github.com/jarvis394/neura` },
      { name: 'DiscordBots', value: `https://top.gg/bot/704395625332211762` },
    )
    .setThumbnail('https://images.discordapp.net/avatars/704395625332211762/a68130df26ff41bf6dc3f2475f4509e2.png?size=512')
    .setTimestamp()
    .setFooter('Made by jarvis394#8343')

  const defaultChannelID = getDefaultChannel(guild)
  const defaultChannelData = guild.channels.cache.get(defaultChannelID) as Discord.TextChannel
  return defaultChannelData.send(embed).then(() => {
    defaultChannelData.send("https://discord.gg/3YAZc7r - **Support server**")
  })
})

client.on('disconnect', () => {
  log.warn("Disconnected from Discord")
  log.info("Attempting to log in...")
  client.login(process.env.TOKEN)
})

client.login(process.env.TOKEN)
