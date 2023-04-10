import * as storage from '../utils/storage'

document
  .getElementById('resetBlacklistButton')
  .addEventListener('click', async function () {
    await storage.set('blacklist', [])
  })
