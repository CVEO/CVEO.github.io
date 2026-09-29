import { check } from 'linkinator'

// 外链全量核查（手动运行，不进 CI）：node scripts/link-check-external.js
// 只打印失效外链清单，供人工复核（仓库改名、DOI 变更、合作单位官网下线等）。
const result = await check({
  path: 'dist',
  recurse: true,
  timeout: 15000,
})

const broken = result.links.filter(l => l.state === 'BROKEN')

if (broken.length) {
  console.warn(`⚠ ${broken.length} 个链接不可达:`)
  broken.forEach(f => console.warn(`  ${f.url}`))
  process.exitCode = 1
} else {
  console.log(`✓ 全部 ${result.links.length} 条链接可达`)
}
