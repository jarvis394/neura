import log from '../log'
import { MessageExtended } from '.'

export default async (message: MessageExtended): Promise<void> => {
  const { command, arguments: args } = message.state

  // Try running command file
  try {
    // Run asynchronously
    await command.exec({ message, args })
  } catch (e) {
    // Throw away if command was not found
    // Usually cannot happend due to the 'filter' middleware.
    if (e.code === 'MODULE_NOT_FOUND') log.error(e)
    // In other case, handle this error
    else {
      log.error(e)
      message.reply('Something wrong has happened: ' + e.message)
    }
  }
}
