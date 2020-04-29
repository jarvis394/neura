import { GenerateCommand } from '../commands/generate'
import { MessageExtended } from '.'
import log from './log'

export default async (message: MessageExtended): Promise<void> => {
  const command = new GenerateCommand()

  log(message)
  return await command.exec({ message, args: message.state.arguments })
}
