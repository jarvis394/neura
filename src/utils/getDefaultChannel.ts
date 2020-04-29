import { Guild } from 'discord.js'

export default (guild: Guild): string => {
  if (guild.channels.cache.has(guild.id))
    return guild.id

  if (guild.channels.cache.find(r => r.name === "general"))
    return guild.channels.cache.find(n => n.name === "general").id

  return guild.channels.cache
    .filter(c => c.type === "text" &&
      c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
    .sort((a, b) => a.position - b.position)
    .first().id
}