import { check } from 'linkinator'

// CI 门禁：只检查站内链接（本地文件解析，秒级完成、结果确定）。
// 外部链接（DOI/GitHub/公众号等）受目标站点与网络环境影响大，不进部署门禁；
// 如需全量核查可运行：node scripts/link-check-external.js
const result = await check({
  path: 'dist',
  recurse: true,
  linksToSkip: (url) => /^https?:\/\//i.test(url) && !url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1'),
})

const broken = result.links.filter(l => l.state === 'BROKEN')

if (broken.length) {
  console.error(`✗ [link-check] ${broken.length} 个站内链接失效:`)
  broken.forEach(f => console.error(`  ${f.url}`))
  process.exit(1)
}

console.log(`✓ [link-check] 站内链接全部可达（共 ${result.links.length} 条）`)
