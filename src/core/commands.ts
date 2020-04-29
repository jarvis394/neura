import { GenerateCommand } from '../commands/generate'
import { HelpCommand } from '../commands/help'

const commands = [
  new GenerateCommand(),
  new HelpCommand()
]

export default commands
