import * as storage from '../utils/storage'

const whiteSet = new Set<string>()

const removeTweets = async function () {
  const blacklist = await storage.get('blacklist', [])
  const blackSet = new Set(blacklist)

  const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]')

  for (const cell of cells) {
    const anchors = cell.querySelectorAll('a')
    const anchor = Array.from(anchors).filter(function (anchor) {
      return anchor.textContent.startsWith('@')
    })[0]

    if (typeof anchor === 'undefined') {
      continue
    }

    const username = anchor.textContent

    if (blackSet.has(username)) {
      cell.setAttribute('removed', '')
    } else if (whiteSet.has(username)) {
      continue
    } else {
      whiteSet.add(username)
      window.open(anchor.href + '?j=0')
    }
  }

  setTimeout(removeTweets, 500)
}

export default async function () {
  const url = new URL(location.href)
  if (url.searchParams.has('j')) {
    window.close()
    return
  }

  removeTweets()
}
