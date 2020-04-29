import chalk from 'chalk'

export const COLORS = {
  debug: chalk.cyan,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.white,
  success: chalk.green,
  command: chalk.cyan,
}

export const LEVELS = {
  error: 0,
  warn: 1,
  debug: 2,
  info: 3,
  success: 4,
  command: 5,
}
