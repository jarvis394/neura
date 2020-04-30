import Database from 'better-sqlite3'
import { PREFIX } from '../config/constants'
import db from '../database'

const defaultData = {
  auto_interval: 25,
  auto_enabled: 1,
  prefix: PREFIX
}

export interface GuildModel {
  id?: string
  auto_interval: number
  auto_enabled: number
  prefix: string
}

class Guild {
  readonly id: string

  constructor(id: string | number) {
    this.id = id.toString()

    const data: GuildModel = db
      .prepare(`SELECT * FROM main.guilds WHERE id = ${this.id}`)
      .get()
    if (!data) {
      this.setData(defaultData)
    }

    return this
  }

  /**
   * Sets data to db
   * @param {object} data Data to set
   */
  setData(data: GuildModel): Database.RunResult {
    data.id = this.id

    return db.prepare(
      'INSERT OR REPLACE INTO main.guild (id, auto_interval, auto_enabled, prefix) VALUES (@id, @auto_interval, @auto_enabled, @prefix);'
    ).run(data)
  }

  /**
   * Guild's auto interval parameter
   */
  get autoInterval() {
    return db.prepare(`SELECT auto_interval FROM main.guild WHERE id = ${this.id};`).get().auto_interval
  }
  
  /**
   * Guild's auto enabled parameter status
   */
  get autoEnabled() {
    return db.prepare(`SELECT auto_enabled FROM main.guild WHERE id = ${this.id};`).get().auto_enabled
  }
  
  /**
   * Guild's prefix
   */
  get prefix() {
    return db.prepare(`SELECT prefix FROM main.guild WHERE id = ${this.id};`).get().prefix
  }

  setAutoInterval(interval: number) {
    return db.prepare(`UPDATE main.guild SET auto_interval = ${interval} WHERE id = ${this.id};`)
  }

  setAutoEnabled(state: boolean) {
    return db.prepare(`UPDATE main.guild SET auto_enabled = ${state ? 1 : 0} WHERE id = ${this.id};`)
  }

  setPrefix(prefix: string) {
    return db.prepare(`UPDATE main.guild SET prefix = ${prefix} WHERE id = ${this.id};`)
  }
}

export default Guild