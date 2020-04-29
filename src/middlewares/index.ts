import { client } from '../core'
import { compose } from 'middleware-io'
import mention from './mention'
import runCommand from './command'
import log from './log'
import counter from './counter'
import filter from './filter'
import payload from './payload'
import { Message } from 'discord.js'
import Command from '../models/Command'

export interface State {
  isCommand: boolean
  isMentionMessage: boolean
  isPrefixed: boolean
  isMentioned: boolean
  isAdmin: boolean
  commandText: string
  command: Command
  arguments: string[]
}

export class MessageExtended extends Message {
  state: Partial<State> = {}
}

const composedMiddleware = compose<MessageExtended>([
  counter, // Count messages
  filter, // Filter messages
  payload, // Set message payload
])

client.on('message', async (msg) => {
  const message = msg as MessageExtended
  await composedMiddleware(message, async () => { })

  // If message is only mention
  // then return mention message
  if (message.state.isMentionMessage) {
    return mention(message)
  }

  // Else if message is command then
  // log it and run the command
  else if (message.state.isCommand) {
    log(message)
    return runCommand(message)
  }

  // Otherwise ignore
  else return
})