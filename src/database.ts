import Database, { Database as IDatabase } from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { PREFIX } from './config/constants'

const dbDirPath: string = path.resolve(process.cwd(), 'data')
const dbPath: string = path.resolve(dbDirPath, 'main.sqlite')

if (!fs.existsSync(dbPath)) fs.mkdirSync(dbDirPath)

const db: IDatabase = new Database(dbPath)

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "guilds" (
    "id"	                TEXT NOT NULL,
    "auto_interval"	      INTEGER NOT NULL DEFAULT 25,
    "auto_enabled"	      INTEGER NOT NULL DEFAULT 1,
    "prefix"	            TEXT NOT NULL DEFAULT ${PREFIX},
    PRIMARY KEY("id")
  )
`
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS "channels" (
    "id"	            TEXT NOT NULL,
    "disabled"	      INTEGER NOT NULL DEFAULT 0,
    "auto_disabled"	  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY("id")
  )
`
).run()

export default db