import record from './record'
import remove from './remove'

setTimeout(async function () {
  await record()
  await remove()
}, 2000)
