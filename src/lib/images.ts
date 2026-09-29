import type { ImageMetadata } from 'astro'

/**
 * 将数据文件中的 `/assets/...` 路径解析为 src/assets 下图片的构建时引用。
 *
 * 图片资产存放在 `src/assets/`（内容管理规范中的 `/assets/...` 路径写法保持不变），
 * 经由 astro:assets 在构建期生成优化后的 WebP 并带上正确尺寸。
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true }
)

const byPath = new Map<string, ImageMetadata>()
for (const [file, mod] of Object.entries(files)) {
  // '/src/assets/news/x.jpg' -> '/assets/news/x.jpg'
  byPath.set(file.replace(/^\/src/, ''), mod.default)
}

export function resolveImage(path?: string | null): ImageMetadata | null {
  if (!path) return null
  const clean = path.split('?')[0]?.split('#')[0] ?? ''
  return byPath.get(clean) ?? null
}
