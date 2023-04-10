import { fetchDOM } from 'utils/fetch'
import ids from '../ids.json'
import * as storage from '../utils/storage'

const removeTweets = function (regex: RegExp | null) {
  if (regex === null) {
    return
  }

  document
    .querySelectorAll('[data-testid="cellInnerDiv"]')
    .forEach(async function (cell) {
      const anchors = document.querySelectorAll('a')
      const anchor = Array.from(anchors).filter(function (anchor) {
        return anchor.textContent.startsWith('@')
      })[0]

      if (typeof anchor === 'undefined') {
        return
      }

      const dom = await fetchDOM(anchor.href)

      const text = ['Name', 'Description', 'Location', 'Url']
        .map(function (key) {
          const value = dom.querySelector(
            `[data-testid="User${key}"]`
          )?.textContent
          if (value === null) {
            return null
          }

          return `${key}: ${value}`
        })
        .filter((value) => value !== null)
        .join('\n')

      if (regex.test(text)) {
        cell.remove()
      }
    })
}

const regexList = ids.map(async function (id) {
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

setInterval(function () {
  regexList.forEach(async function (regex) {
    removeTweets(await regex)
  })
}, 1000)
