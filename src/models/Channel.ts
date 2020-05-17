import Database from 'better-sqlite3'
import db from '../database'

const defaultData = {
  disabled: 0,
  auto_enabled: 1
}

export interface ChannelModel {
  id?: string
  disabled: number
  auto_enabled: number
  guild_id?: string
}

class Channel {
  readonly id: string
  readonly guildId: string

  constructor(id: string | number, guildId: string | number) {
    this.id = id.toString()
    this.guildId = guildId.toString()

    const data: ChannelModel = db
      .prepare(`SELECT * FROM main.channels WHERE id = ${this.id}`)
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
  setData(data: ChannelModel): Database.RunResult {
    data.id = this.id
    data.guild_id = this.guildId

    return db.prepare(
      'INSERT OR REPLACE INTO main.channels (id, disabled, auto_enabled, guild_id) VALUES (@id, @disabled, @auto_enabled, @guild_id);'
    ).run(data)
  }

  /**
   * Channel's disabled status
   * That means that the bot will not process commands from this channel
   */
  get disabled() {
    return db.prepare(`SELECT disabled FROM main.channels WHERE id = ${this.id};`).get().disabled
  }
  
  /**
   * Channel's auto disabled status
   * Meaning in this channel random messages won't be sent
   */
  get autoEnabled() {
    return db.prepare(`SELECT auto_enabled FROM main.channels WHERE id = ${this.id};`).get().auto_enabled
  }

  setDisabled(state: boolean) {
    return db.prepare(`UPDATE main.channels SET disabled = ${state ? 1 : 0} WHERE id = ${this.id};`).run()
  }

  setAutoEnabled(state: boolean) {
    return db.prepare(`UPDATE main.channels SET auto_enabled = ${state ? 1 : 0} WHERE id = ${this.id};`).run()
  }
}

export default Channel