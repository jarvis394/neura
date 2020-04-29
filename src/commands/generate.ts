import Command, { ExecOptions } from '../models/Command'
import redis from 'redis'

interface RedisMessage {
  id: string
  result: string
}

export class GenerateCommand implements Command {
  name = 'generate'
  description = {
    en: 'Generates a random sentence using Markov chains',
    ru: 'Создаёт рандомное сообщение используя цепочки Маркова'
  }
  alias = ['g', 'gen', 'ген', 'г']

  async exec({ message }: ExecOptions) {
    const id = message.id
    const pub = redis.createClient()
    const channelID = message.channel.id
    const messages = await message.channel.messages.fetch({ limit: 100 })
    const samples = messages.map((e) => e.content)
    const sub = redis.createClient()

    // Once got the message, send the result if it is valid
    sub.on('message', (_, json: string) => {
      const redisMessage: RedisMessage = JSON.parse(json)
      const hasValidID = redisMessage.id === id

      if (hasValidID) {
        message.channel.send(redisMessage.result ? redisMessage.result : 'Cannot generate a message, sorry 😭')
      }

      sub.unsubscribe()
    })

    sub.on('ready', () => {
      // Subscribe to the response channel
      sub.subscribe('response-channel', (error) => {
        if (error) throw error
      })

      // Publish a channel ID to the requests channel
      pub.publish('request-channel', JSON.stringify({ channelID, id, samples }))
    })
  }
}