/**
 * 一次性生成社交分享图与触屏图标（产物已提交到 public/，无需在 CI 中运行）。
 * 运行：node scripts/generate-social-assets.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logoPath = path.join(root, 'src/assets/logos/logo.png')
const publicDir = path.join(root, 'public')

fs.mkdirSync(publicDir, { recursive: true })

// 1) apple-touch-icon：180×180 方形 logo
await sharp(logoPath)
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'))
console.log('✓ public/apple-touch-icon.png (180×180)')

// 2) OG 分享图：1200×630，品牌色底 + logo + 标题
const brand = '#2d1f5c'
const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${brand}"/>
  <circle cx="1050" cy="80" r="260" fill="#ffffff" opacity="0.04"/>
  <circle cx="120" cy="600" r="200" fill="#ffffff" opacity="0.04"/>
  <text x="120" y="270" font-family="'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', sans-serif" font-size="76" font-weight="bold" fill="#ffffff">武汉大学 CVEO 课题组</text>
  <text x="122" y="360" font-family="'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', sans-serif" font-size="40" fill="#d4cfff">计算机视觉与地球观测交叉研究团队</text>
  <text x="122" y="470" font-family="'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', sans-serif" font-size="30" fill="#8f7cff">遥感影像智能分析 · 三维遥感重建 · 时序动态监测</text>
  <text x="122" y="545" font-family="Arial, sans-serif" font-size="28" fill="#b3a8ff">www.whu-cveo.com</text>
</svg>`

await sharp(logoPath)
  .resize(220, 220)
  .png()
  .toBuffer()
  .then(logoBuf =>
    sharp({
      create: { width: 1200, height: 630, channels: 4, background: { r: 45, g: 31, b: 92, alpha: 1 } }
    })
      .composite([
        { input: Buffer.from(svg), top: 0, left: 0 },
        { input: logoBuf, top: 360, left: 860 }
      ])
      .jpeg({ quality: 90 })
      .toFile(path.join(publicDir, 'og-image.jpg'))
  )
console.log('✓ public/og-image.jpg (1200×630)')
