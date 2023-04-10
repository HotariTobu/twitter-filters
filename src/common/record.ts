import ids from '../ids.json'
import * as storage from '../utils/storage'

const getRegexList = async function () {
  const promises = ids.map(async function (id) {
    const filtersStr = await storage.get(id, '')
    const filterLines = filtersStr.split('\n')
    const filterStrs = filterLines.map((line) => line.trim())
    const filters = filterStrs.filter((str) => str.length > 0)

    if (filters.length === 0) {
      return null
    }

    const patterns = filters.map((str) => `(?:${str})`)
    const pattern = patterns.join('|')
    return new RegExp(pattern)
  })

  const regexList = await Promise.all(promises)
  return regexList.filter((regex) => regex !== null)
}

const judge = async function () {
  const spans = document.querySelectorAll('[data-testid="UserName"] span')
  const span = Array.from(spans).filter(function (span) {
    return span.textContent.startsWith('@')
  })[0]

  if (typeof span === 'undefined') {
    return null
  }

  const text = ['Name', 'Description', 'Location', 'Url']
    .map(function (key) {
      const span = document.querySelector(`[data-testid="User${key}"]`)
      if (span === null) {
        return null
      }

      return `${key}: ${span.textContent}`
    })
    .filter((value) => value !== null)
    .join('\n')

  for (const regex of await getRegexList()) {
    if (regex.test(text)) {
      return span.textContent
    }
  }

  return null
}

export default async function () {
  const username = await judge()
  if (username === null) {
    return
  }

  const blacklist = await storage.get('blacklist', [])
  blacklist.push(username)
  await storage.set('blacklist', blacklist)
}
