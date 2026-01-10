import { check } from 'linkinator'

const result = await check({ path: 'dist', recurse: true })
const failed = result.links.filter(l => l.state === 'BROKEN')
if (failed.length) {
  console.error(failed.map(f => f.url).join('\n'))
  process.exit(1)
}
console.log('OK')
