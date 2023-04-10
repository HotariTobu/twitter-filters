import ids from '../ids.json'
import * as storage from '../utils/storage'
import './event'

ids.forEach(async function (id) {
  const element = document.getElementById(id)
  if (element === null) {
    return
  }

  if (!(element instanceof HTMLTextAreaElement)) {
    return
  }

  element.value = await storage.get(id)

  element.addEventListener('input', function () {
    storage.set(id, element.value)
  })
})

storage.get('blacklist', ['^_^']).then(function (blacklist) {
  document.getElementById('blacklist').textContent = blacklist.join(' / ')
})
