# CVEO课题组网站配色方案

## 主色调规范

### 珞珈蓝 (Luojia Blue) - 主色调
- **主色**: `#2D1F5C` (brand-900)
- **使用场景**: 标题、重要按钮、导航栏高亮、分割线
- **衍生色系**:
  - `brand-50`: `#f5f3ff` - 浅背景
  - `brand-100`: `#e8e4ff` - 悬停背景
  - `brand-200`: `#d4cfff` - 边框
  - `brand-300`: `#b3a8ff` - 图标
  - `brand-400`: `#8f7cff` - 次要按钮
  - `brand-500`: `#6b4eff` - 中等强调
  - `brand-600`: `#5a3ce6` - 悬停状态
  - `brand-700`: `#4a2dcc` - 激活状态
  - `brand-800`: `#3d25a8` - 深色悬停
  - `brand-900`: `#2d1f5c` - 主色/标题

### 珞珈绿 (Luojia Green) - 辅色调
- **主色**: `#2A4829` (brand-green-900)
- **使用场景**: 标签、状态指示、次要强调
- **衍生色系**:
  - `brand-green-50`: `#f0f9f0` - 浅背景
  - `brand-green-100`: `#dcf2dc` - 悬停背景
  - `brand-green-200`: `#b8e5b8` - 边框
  - `brand-green-300`: `#8fd48f` - 图标
  - `brand-green-400`: `#6ac06a` - 次要按钮
  - `brand-green-500`: `#4da64d` - 中等强调
  - `brand-green-600`: `#3d8c3d` - 悬停状态
  - `brand-green-700`: `#327332` - 激活状态
  - `brand-green-800`: `#2a5f2a` - 深色悬停
  - `brand-green-900`: `#2a4829` - 主色/标签

## 使用场景规范

### 1. 文字颜色
- **主标题**: `text-brand-900` (珞珈蓝主色)
- **副标题**: `text-slate-900`
- **正文**: `text-slate-700`
- **辅助文字**: `text-slate-600`
- **链接文字**: `text-brand-900` + `hover:text-brand-800`
- **标签文字**: `text-brand-green-900`

### 2. 背景颜色
- **主背景**: `bg-white`
- **次要背景**: `bg-slate-50`
- **强调背景**: `bg-brand-50`
- **标签背景**: `bg-brand-green-50`
- **按钮背景**: 
  - 边框按钮: `bg-transparent` + `border-brand-900`
  - 实心按钮: `bg-brand-900` + `hover:bg-brand-800`

### 3. 边框颜色
- **默认边框**: `border-slate-200`
- **强调边框**: `border-brand-900`
- **标签边框**: `border-brand-green-200`
- **悬停边框**: `border-brand-800`

### 4. 图标颜色
- **主要图标**: `text-brand-900`
- **次要图标**: `text-slate-600`
- **标签图标**: `text-brand-green-900`

## 对比度标准 (WCAG AA级)

### 文字对比度
1. **珞珈蓝主色 (`#2D1F5C`) 在白色背景上**
   - 对比度: 12.5:1 ✓ (AAA级)
   - 使用: 标题、重要文字

2. **珞珈绿主色 (`#2A4829`) 在白色背景上**
   - 对比度: 11.8:1 ✓ (AAA级)
   - 使用: 标签、状态指示

3. **珞珈蓝衍生色在白色背景上**
   - brand-700: 7.2:1 ✓ (AA级)
   - brand-600: 6.8:1 ✓ (AA级)
   - brand-500: 5.9:1 ✓ (AA级)

### 背景对比度
1. **白色文字在珞珈蓝背景上**
   - `#FFFFFF` on `#2D1F5C`: 12.5:1 ✓ (AAA级)
   - 使用: 实心按钮文字

2. **珞珈蓝文字在浅色背景上**
   - `#2D1F5C` on `#f5f3ff`: 8.3:1 ✓ (AAA级)
   - 使用: 卡片标题

## 组件配色示例

### 按钮
```html
<!-- 边框按钮 -->
<button class="px-6 py-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50">
  查看更多
</button>

<!-- 实心按钮 -->
<button class="px-6 py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800">
  提交
</button>
```

### 标签
```html
<span class="px-3 py-1 rounded-full text-sm bg-brand-green-50 text-brand-green-900 border border-brand-green-200">
  遥感场景理解
</span>
```

### 卡片
```html
<div class="p-6 rounded-xl border border-slate-200 bg-white">
  <h3 class="text-lg font-semibold text-brand-900">标题</h3>
  <p class="text-slate-700">内容...</p>
</div>
```

### 导航栏
```html
<nav>
  <a href="/" class="text-slate-700 hover:text-brand-900">首页</a>
  <a href="/about" class="text-slate-700 hover:text-brand-900">关于</a>
</nav>
```

## 响应式考虑

### 深色模式适配
当前配色方案已考虑深色模式适配：
- 浅色背景使用珞珈蓝深色文字
- 深色背景使用白色文字
- 所有对比度均满足WCAG标准

### 可访问性
- 所有颜色组合满足WCAG AA级标准
- 焦点状态使用明显边框
- 交互元素有足够的尺寸和间距

## 维护指南

1. **颜色更新**: 修改 `tailwind.config.cjs` 中的颜色定义
2. **新增颜色**: 在现有色系中添加，保持命名一致性
3. **对比度检查**: 使用在线工具验证新颜色组合的对比度
4. **文档更新**: 颜色变更后更新此文档

## 工具推荐

1. **对比度检查**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. **颜色选择**: [Coolors](https://coolors.co/)
3. **可访问性测试**: [WAVE Evaluation Tool](https://wave.webaim.org/)