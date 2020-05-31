import Command, { ExecOptions } from '../models/Command'
import { StringGenerator, formatters, validators } from 'markov-catena'

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
    const channelID = message.channel.id
    const messages = await message.channel.messages.fetch({ limit: 100 })
    const samples = messages.map((e) => e.content).filter(e => e !== '')
    const generator = new StringGenerator(samples)
    const result = generator.generateString({
      formatter: formatters.usualSyntax,
      validator: validators.wordsCount(2, 20)
    })
    
    await message.channel.send(result)
  }
}