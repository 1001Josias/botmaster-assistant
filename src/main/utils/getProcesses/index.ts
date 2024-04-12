import fs from 'fs'

export default function getProcesses(): {
  name: string
  path: string
  key: string
  description: string
  id: number
}[] {
  return fs
    .readdirSync(`${__dirname}/bots`, { withFileTypes: true })
    .filter((bot) => bot.isFile())
    .map((bot, id) => ({
      id,
      key: bot.name.replace('.js', ''),
      path: `${bot.path}/${bot.name}`,
      description: 'This is a bot that does something',
      name: bot.name
        .replace('.js', '')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }))
}
