import Database from 'better-sqlite3'
import db from '../database'

const defaultData = {
  disabled: 0,
  auto_disabled: 0
}

export interface ChannelModel {
  id?: string
  disabled: number
  auto_disabled: number
}

class Channel {
  readonly id: string

  constructor(id: string | number) {
    this.id = id.toString()

    const data: ChannelModel = db
      .prepare(`SELECT * FROM main.channel WHERE id = ${this.id}`)
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

    return db.prepare(
      'INSERT OR REPLACE INTO main.channel (id, disabled, auto_disabled) VALUES (@id, @disabled, @auto_disabled);'
    ).run(data)
  }

  /**
   * Channel's disabled status
   * That means that the bot will not process commands from this channel
   */
  get disabled() {
    return db.prepare(`SELECT auto_interval FROM main.channel WHERE id = ${this.id};`).get().auto_interval
  }
  
  /**
   * Channel's auto disabled status
   * Meaning in this channel random messages won't be sent
   */
  get autoDisabled() {
    return db.prepare(`SELECT auto_enabled FROM main.channel WHERE id = ${this.id};`).get().auto_enabled
  }

  setDisabled(state: boolean) {
    return db.prepare(`UPDATE main.channel SET disabled = ${state ? 1 : 0} WHERE id = ${this.id};`)
  }

  setAutoDisabled(state: boolean) {
    return db.prepare(`UPDATE main.channel SET auto_disabled = ${state ? 1 : 0} WHERE id = ${this.id};`)
  }
}

export default Channel