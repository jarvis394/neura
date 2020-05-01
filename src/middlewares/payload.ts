import { PREFIX } from '../config/constants'
import { client } from '../core/index'
import commands from '../core/commands'
import { MessageExtended } from '.'
import Guild from '../models/Guild'

export default async (
  update: MessageExtended,
  next: Function
): Promise<void | number> => {
  const { content, member, state } = update
  const mentionPrefix = `<@!${client.user.id}>`
  const guild = new Guild(update.guild.id)
  const prefix = guild.prefix || PREFIX
  let msg: string = content // Temporary message text

  // Check if command's prefix is mention or usual prefix
  // If none found then return
  if (content.startsWith(mentionPrefix)) {
    state.isMentioned = true
  } else if (content.startsWith(prefix)) {
    state.isPrefixed = true
  } else return

  // Remove mention from message text if it is mentioned
  // Otherwise, remove the prefix
  if (state.isMentioned) {
    msg = content
      .split(' ')
      .slice(1)
      .join(' ')
  } else if (state.isPrefixed) {
    msg = content.slice(prefix.length)
  } else {
    state.isCommand = false
  }

  // Check if user is admin
  state.isAdmin = member.hasPermission('MANAGE_GUILD') || member.hasPermission('ADMINISTRATOR')

  // If message is possibly command
  if (state.isMentioned || state.isPrefixed) {
    // Command is the first word in message
    state.commandText = msg.split(' ').shift()

    // Arguments are everything after command
    state.arguments = msg.split(' ').slice(1)

    // Trim arguments
    state.arguments = state.arguments
      .map(a => a.trim())
      .filter(a => a.length !== 0)

    commands.forEach(c => {
      const commandFound = (s: string) => c.name === s
      const aliasFound = (s: string) => c.alias && c.alias.some(e => s === e)

      if (commandFound(state.commandText) || aliasFound(state.commandText)) {
        state.command = c
      }
    })

    // Update the state
    state.isCommand = !!state.command
  }

  // If there is only mention then set the state and return
  if (state.isMentioned && !state.isCommand) {
    state.isMentionMessage = true
  }

  await next()
}
