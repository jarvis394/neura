import Discord from 'discord.js'
import dotenv from 'dotenv'
import express from 'express'
import redis from 'redis'

interface Message {
  id: string
  result: string
}

// Initialize all environment variables to appear in the process.env
dotenv.config()

const app = express()
const pub = redis.createClient()

console.clear()
app.listen(process.env.PORT, () =>
  console.log('Started web server on port', process.env.PORT)
)

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (msg) => {
  const isMentioned = msg.mentions.users.some((e) => e.id === client.user.id)
  const isCommand = msg.content.startsWith('!g')

  if (isMentioned || isCommand) {
    const id = msg.id
    const channelID = msg.channel.id
    const sub = redis.createClient()

    console.log('COMMAND:', id, channelID)

    // Once got the message, send the result if it is valid
    sub.on('message', (_, json: string) => {
      const message: Message = JSON.parse(json)
      const hasValidID = message.id === id

      if (hasValidID) {
        console.log('+ RESPONSE:', message.id, hasValidID)
        msg.channel.send(message.result)
        sub.unsubscribe()
      } else {
        console.log(`- WRONG (${id}):`, message.id, hasValidID)
      }
    })

    // Subsribe to the response channel
    sub.subscribe('response-channel', (error, reply) => {
      if (error) throw error
    })

    // Publish a channel ID to the requests channel
    pub.publish('request-channel', JSON.stringify({ channelID, id }))
  }
})

client.login(process.env.TOKEN)
