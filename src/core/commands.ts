import { GenerateCommand } from '../commands/generate'
import { HelpCommand } from '../commands/help'
import { ConfigCommand } from '../commands/config'

const commands = [
  new GenerateCommand(),
  new HelpCommand(),
  new ConfigCommand()
]

export default commands
