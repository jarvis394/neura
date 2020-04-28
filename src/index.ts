import Discord from 'discord.js'
import dotenv from 'dotenv'
import express from 'express'
import redis from 'redis'

// Initialize all environment variables to appear in the process.env
dotenv.config()

const app = express()
const pub = redis.createClient()
const sub = redis.createClient()

console.clear()
app.listen(process.env.PORT, () =>
  console.log('Started web server on port', process.env.PORT)
)

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

sub.subscribe('response-channel', (error, reply) => {
  if (error) throw error
  else console.log(`Subscribed to "${reply}" channel. Listening for updates.`)
})

client.on('message', async (msg) => {
  const isMentioned = msg.mentions.users.some((e) => e.id === client.user.id)
  const isCommand = msg.content.startsWith('!g')

  if (isMentioned || isCommand) {
    const id = msg.id
    const idLength = id.length
    const channelID = msg.channel.id
    const channelIDLength = channelID.length
    
    console.log('COMMAND:', id, channelID)

    // Once got the message, send the result if it is valid
    sub.once('message', (channel, message: string) => {
      const hasValidID = message.slice(0, idLength) === id
      const hasValidChannelID = message.slice(idLength, idLength + channelIDLength) === channelID
      if (hasValidID && hasValidChannelID) {
        msg.channel.send(message.slice(idLength + channelIDLength))
      } else {
        console.log(
          'Got an unexpected message (id:',
          id + ', channelID:',
          channelID + '):',
          channel,
          message
        )
      }
    })

    // Publish a channel ID to the requests channel
    pub.publish('request-channel', JSON.stringify({ channelID, id }))
  }
})

client.login(process.env.TOKEN)
