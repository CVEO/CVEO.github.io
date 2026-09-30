/**
 * 构建研究成果知识图谱（构建期执行，产出纯静态 SVG 数据）。
 *
 * 运行：node scripts/build-knowledge-graph.mjs（已挂 npm prebuild 钩子）
 * 输出：src/data/knowledge-graph.json
 *
 * 布局：课题组居中，三个研究方向各占 120° 扇区（扇区内按"代表作优先+年代倒序"
 * 由内向外螺旋排布），开源仓库/数据集挂在对应论文外侧，奖项/在研项目/导师
 * 分布在扇区间隙。d3-force 仅做碰撞松弛，不改变整体径向结构。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { forceSimulation, forceCollide, forceX, forceY } from 'd3-force'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// ---------- 数据读取 ----------
const papersDir = path.join(root, 'src/content/papers')

function parseFrontmatter(raw) {
  const m = raw.split(/^---\r?\n/)[1]
  if (!m) return null
  const end = m.indexOf('---')
  const fm = m.slice(0, end)
  const get = (re) => {
    const r = fm.match(re)
    return r ? r[1] : undefined
  }
  const list = (re) => {
    const r = fm.match(re)
    if (!r) return []
    try {
      return JSON.parse(r[1].replace(/'/g, '"'))
    } catch {
      return []
    }
  }
  return {
    title: get(/title: *"([^"]*)"/) || '',
    date: get(/date: *"([^"]*)"/) || '',
    link: get(/link: *"([^"]*)"/) || '',
    authors: list(/authors: *(\[[^\]]*\])/),
    corresponding: list(/corresponding: *(\[[^\]]*\])/).map(Number),
    featured: /featured: *true/.test(fm)
  }
}

// 图谱只收录通讯/一作论文（合作论文不体现在图谱中）
const papers = []
for (const dir of ['our']) {
  const full = path.join(papersDir, dir)
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith('.md')) continue
    const data = parseFrontmatter(fs.readFileSync(path.join(full, f), 'utf8'))
    if (!data || !data.title) continue
    papers.push({ id: `${dir}/${f.replace(/\.md$/, '')}`, dir, ...data })
  }
}

const openProjects = JSON.parse(fs.readFileSync(path.join(root, 'src/data/open-projects.json'), 'utf8'))
const awards = JSON.parse(fs.readFileSync(path.join(root, 'src/data/awards.json'), 'utf8'))
const allProjects = JSON.parse(fs.readFileSync(path.join(root, 'src/data/research-projects.json'), 'utf8'))
const directionsData = JSON.parse(fs.readFileSync(path.join(root, 'src/data/directions.json'), 'utf8'))
const activeProjects = allProjects.filter(p => p.status === '在研')

// ---------- 方向打标：featured 种子 → 关键词规则 ----------
const DIR_KEYS = directionsData.directions.map(d => d.name)
const [K_INTERP, K_3D, K_MON] = DIR_KEYS

// featured 论文作为各方向的种子
const seedDir = {}
for (const d of directionsData.directions) {
  for (const p of d.papers) seedDir[p.slug] = d.name
}

// 关键词规则：三维/监测优先（更特异），解译兜底
const RULES = [
  { dir: K_3D, kw: ['stereo', 'matching', 'dsm', '3d', 'roof', 'building', 'lidar', 'point cloud', 'video', 'tracking', 'epipolar', 'facade', 'uav image', 'registration', ' keypoints', 'mosaic', 'reconstruction', 'calibration', 'geometric', '实景三维', '立体', '匹配', '三维', '激光雷达', '屋顶', '建筑', '视频', '跟踪', '点云', '选线', '线路设计', '单体化', '配准', '模型缺陷', '数字栅格', '几何'] },
  { dir: K_MON, kw: ['npp', 'vegetation', 'productivity', 'urban ', 'urban-', 'socio', 'social economic', 'gdp', 'monitoring', 'land use', 'farmland', 'yellow river', 'carbon', 'spatio-temporal fusion', 'mobility', 'flow', 'soil moisture', 'disease', 'pine wilt', '土地利用变化', '监测', '植被', '城市', '经济', '国情', '滑坡', '农业', '耕地', '生产力', '时空', '普查'] },
  { dir: K_INTERP, kw: ['classif', 'segmentation', 'detection', 'detecting changes', 'fusion', 'sar', 'denois', 'de-nois', 'speckle', 'edge', 'recogni', 'superpixel', 'shadow', 'network', 'deep', 'wavelet', 'transform', 'resampling', 'extraction', 'region of interest', 'level set', 'semivariogram', 'comparison', 'simulation', 'spectral', 'near-infrared', 'geostar', 'spatial data', 'emd', 'pulsar', 'classification', '降噪', '消噪', '图像', '分类', '分割', '变化检测', '融合', '识别', '边缘', '斑点', '提取', '网络', '小波', '纠正', '影像', '经验模态分解', '独立成分', '脉冲星'] }
]

function assignDirection(paper) {
  if (seedDir[paper.id]) return { dir: seedDir[paper.id], how: 'seed' }
  const title = paper.title.toLowerCase()
  for (const rule of RULES) {
    if (rule.kw.some(k => title.includes(k))) return { dir: rule.dir, how: 'rule' }
  }
  return { dir: null, how: 'unmatched' }
}

const unmatched = []
for (const p of papers) {
  const { dir, how } = assignDirection(p)
  p.direction = dir
  if (!dir) unmatched.push(p)
}

if (unmatched.length) {
  console.warn(`[knowledge-graph] ${unmatched.length} 篇论文未能自动归属研究方向，需人工确认：`)
  unmatched.forEach(p => console.warn(`  - ${p.id} | ${p.title}`))
  // 兜底：归入解译主线，保证图谱完整
  unmatched.forEach(p => { p.direction = K_INTERP })
}

// ---------- 节点与边 ----------
const nodes = []
const edges = []
const byId = new Map()
function addNode(n) {
  if (byId.has(n.id)) return byId.get(n.id)
  byId.set(n.id, n)
  nodes.push(n)
  return n
}
function addEdge(s, t, rel) {
  if (s && t && s !== t) edges.push({ s, t, rel })
}

const center = addNode({ id: 'center', type: 'center', label: 'CVEO 课题组', sub: 'Computer Vision for Earth Observation', r: 17 })

// 研究方向锚点（角度在布局阶段确定）
const dirNodes = DIR_KEYS.map((name, i) => {
  const meta = directionsData.directions.find(d => d.name === name)
  return addNode({ id: `dir-${i}`, type: 'direction', label: name, sub: meta?.description?.slice(0, 40) + '…', r: 13, dirIndex: i })
})
dirNodes.forEach(d => addEdge(center.id, d.id, '聚焦'))

// 论文节点
for (const p of papers) {
  const dirIndex = DIR_KEYS.indexOf(p.direction)
  const year = parseInt(p.date.slice(0, 4), 10) || 0
  addNode({
    id: `paper-${p.id}`,
    type: 'paper',
    label: p.title,
    year,
    dirIndex,
    source: p.dir,
    featured: !!p.featured,
    href: p.link || undefined,
    r: p.featured ? 7 : 3.5
  })
}
for (const p of papers) {
  const dirNode = dirNodes[DIR_KEYS.indexOf(p.direction)]
  addEdge(dirNode.id, `paper-${p.id}`, '包含论文')
}

// 开源仓库 / 数据集
for (const o of openProjects) {
  const type = o.type === 'dataset' ? 'dataset' : 'repo'
  const node = addNode({
    id: `${type}-${o.name}`,
    type,
    label: o.name,
    year: o.year,
    href: o.url,
    r: type === 'dataset' ? 6 : 5.5
  })
  if (o.relatedPaper) {
    const paperNode = byId.get(`paper-${o.relatedPaper}`) || byId.get(`paper-${o.relatedPaper}.md`)
    if (paperNode) {
      addEdge(paperNode.id, node.id, type === 'dataset' ? '发布数据集' : '开源实现')
    } else {
      addEdge(center.id, node.id, '开源产出')
    }
  } else {
    addEdge(center.id, node.id, '开源产出')
  }
}

// 奖项（科技奖励 + 学生竞赛）
awards.forEach((a, i) => {
  const isTech = a.type === 'tech'
  const raw = isTech ? a.project : a.awardName
  const label = raw.length > 18 ? raw.slice(0, 18) + '…' : raw
  const sub = isTech
    ? `${a.awardName} · ${a.prize} · ${a.year}`
    : `${a.prize} · ${a.year}${a.mentor ? ' · ' + a.mentor : ''}`
  addNode({ id: `award-${i}`, type: 'award', label, sub, r: 7 })
  addEdge(center.id, `award-${i}`, '荣获')
})

// 在研项目
activeProjects.forEach((p, i) => {
  addNode({ id: `proj-${i}`, type: 'project', label: p.title, sub: `${p.source} · ${p.period}`, href: '/research-projects', r: 6.5 })
  addEdge(center.id, `proj-${i}`, '承担')
})

// ---------- 径向扇区布局 ----------
const SPAN = 100 // 每个方向扇区弧宽（度），3×100 + 3×20 间隙 = 360
const GAP = 20
const R_DIR = 130 // 方向锚点半径
const R_PAPER_MIN = 215
const R_PAPER_MAX = 465
const R_OUTER = 525 // 开源/数据集半径

const gold = 0.6180339887498949
const dirMeta = nodes.filter(n => n.type === 'direction')

dirMeta.forEach(d => {
  const anchorDeg = -90 + d.dirIndex * 120 // 方向锚点位于 -90°/30°/150°
  d.x = Math.cos((anchorDeg * Math.PI) / 180) * R_DIR
  d.y = Math.sin((anchorDeg * Math.PI) / 180) * R_DIR

  // 该方向的论文：featured 优先，再按年代倒序
  const sectorPapers = nodes
    .filter(n => n.type === 'paper' && n.dirIndex === d.dirIndex)
    .sort((a, b) => (b.featured - a.featured) || (b.year - a.year))

  const half = (SPAN - GAP) / 2
  sectorPapers.forEach((p, i) => {
    const t = (i * gold) % 1 // 黄金比例伪随机角度，避免成环
    const angleDeg = anchorDeg - half + t * (SPAN - GAP)
    const r = R_PAPER_MIN + ((R_PAPER_MAX - R_PAPER_MIN) * i) / Math.max(sectorPapers.length - 1, 1)
    p.x = Math.cos((angleDeg * Math.PI) / 180) * r
    p.y = Math.sin((angleDeg * Math.PI) / 180) * r
    p.angle = angleDeg
  })

  // 开源仓库/数据集挂到对应论文外侧
  nodes
    .filter(n => (n.type === 'repo' || n.type === 'dataset'))
    .forEach(n => {
      const paperEdge = edges.find(e => e.t === n.id && e.s.startsWith('paper-'))
      if (!paperEdge) return
      const paper = byId.get(paperEdge.s)
      if (!paper || paper.angle === undefined) {
        n.x = 0; n.y = -R_OUTER
        return
      }
      // 同一篇论文的多个产出在角度上错开
      const siblings = edges.filter(e => e.s === paperEdge.s && (byId.get(e.t)?.type === 'repo' || byId.get(e.t)?.type === 'dataset'))
      const idx = siblings.findIndex(e => e.t === n.id)
      const offsetDeg = (idx - (siblings.length - 1) / 2) * 9
      const angleRad = ((paper.angle + offsetDeg) * Math.PI) / 180
      n.x = Math.cos(angleRad) * R_OUTER
      n.y = Math.sin(angleRad) * R_OUTER
    })
})

// 扇区间隙放置：奖项 / 在研项目 / 导师
const gapAngles = [-30, 90, 210] // 三个间隙的中心角
const gapItems = nodes.filter(n => ['award', 'project'].includes(n.type))
gapItems.forEach((n, i) => {
  const angleDeg = gapAngles[i % gapAngles.length] + (Math.floor(i / gapAngles.length) - 0.5) * 14
  const r = 120 + Math.floor(i / gapAngles.length) * 55
  n.x = Math.cos((angleDeg * Math.PI) / 180) * r
  n.y = Math.sin((angleDeg * Math.PI) / 180) * r
})

// ---------- d3-force 碰撞松弛（保持径向结构，仅消除局部重叠） ----------
const simNodes = nodes.map(n => ({ ...n }))
const sim = forceSimulation(simNodes)
  .force('collide', forceCollide(n => n.r + 5).iterations(2))
  .force('homeX', forceX(n => n.x ?? 0).strength(0.9))
  .force('homeY', forceY(n => n.y ?? 0).strength(0.9))
  .stop()
for (let i = 0; i < 220; i++) sim.tick()
for (const n of simNodes) {
  const target = byId.get(n.id)
  target.x = Math.round(n.x)
  target.y = Math.round(n.y)
}

// ---------- 输出 ----------
const typeLabel = {
  center: '课题组 / Group', direction: '研究方向 / Direction', paper: '论文 / Paper',
  repo: '开源代码 / Code', dataset: '数据集 / Dataset', award: '奖项 / Award',
  project: '在研项目 / Project'
}
const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  typeLabels: typeLabel,
  nodes: nodes.map(n => ({
    id: n.id, type: n.type, label: n.label, sub: n.sub, year: n.year,
    featured: n.featured || undefined, source: n.source, href: n.href,
    dirIndex: n.dirIndex,
    r: n.r, x: n.x, y: n.y
  })),
  edges
}

fs.writeFileSync(path.join(root, 'src/data/knowledge-graph.json'), JSON.stringify(payload, null, 1) + '\n')

const countBy = {}
nodes.forEach(n => { countBy[n.type] = (countBy[n.type] || 0) + 1 })
console.log(`[knowledge-graph] 节点 ${nodes.length} 个、边 ${edges.length} 条 → src/data/knowledge-graph.json`)
console.log(`[knowledge-graph] 节点分布: ${JSON.stringify(countBy)}`)
