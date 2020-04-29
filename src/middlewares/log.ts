import log from '../log'
import { MessageExtended } from '.'

export default (update: MessageExtended): void => {
  const { content, id, state, author, channel, guild } = update

  // Log message
  log.log({
    level: 'command',
    message: state.isMentioned
      ? '@neura' + content.slice(content.split(' ')[0].length)
      : content,
    authorID: author.id,
    channelID: channel.id,
    guildID: guild.id,
    id,
  })
}
