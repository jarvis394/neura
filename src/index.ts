import Discord from 'discord.js'
import dotenv from 'dotenv'
import Chain from 'purpl-markov-chain'

// Initialize all environment variables to appear in the process.env
dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    const states = ['hello world', 'badabunga', 'hello me', 'nice weather actually']
    const chain = new Chain()
    states.forEach(e => chain.update(e))

    msg.reply(chain.generate())
  }
})

client.login(process.env.TOKEN)
