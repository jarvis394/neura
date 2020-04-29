import { createLogger, format, transports } from 'winston'
import { COLORS, LEVELS } from './config/log'
import chalk from 'chalk'
import moment from 'moment'

const { combine, timestamp, splat, json, errors, simple, printf } = format

const ignorePrivate = format(info => {
  if (info.private) return false
  return info
})

const consoleFormat = printf(info => {
  const timestamp = moment(info.timestamp).format('L LTS')
  const level: string = COLORS[info.level](`${info.level.toUpperCase()}`)
  const service = info.service || 'CORE'
  const isError = info.level === 'error'
  const alignmentLevel = ' '.repeat(7 - info.level.length)
  const alignmentService = ' '.repeat(4 - service.length)
  let m = [
    chalk.bold(isError ? chalk.white(timestamp) : chalk.gray(timestamp)),
    (isError ? chalk.gray : chalk.yellow)(`[${service.toUpperCase()}${alignmentService}]`),
    isError ? chalk.bgRedBright.bold(level) : level,
    alignmentLevel
  ].join(' ')

  if (info.stack) m += chalk.rgb(255, 255, 255)(info.stack)
  else m += isError ? chalk.rgb(255, 255, 255)(info.message) : info.message

  return m
})

const log = createLogger({
  level: 'info',
  levels: LEVELS,
  exitOnError: false,
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      format: ignorePrivate(),
      level: 'error',
      handleExceptions: true,
    }),
    new transports.File({
      filename: 'logs/main.log',
      format: ignorePrivate(),
      level: 'command',
      handleExceptions: true,
    }),
    new transports.Console({
      level: 'command',
      format: combine(simple(), consoleFormat),
      handleExceptions: true,
    }),
  ],
})

export default log
