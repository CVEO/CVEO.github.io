# 按钮样式规范

本文档定义了CVEO网站中按钮样式的统一规范，确保整个网站视觉一致性和用户体验一致性。

## 按钮类型

### 1. 主要按钮 (Primary Button)
用于最重要的操作，如提交表单、确认操作等。

**样式类：**
```html
class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]"
```

**特点：**
- 实心背景色：`bg-brand-900`
- 白色文字
- 悬停状态：`hover:bg-brand-800`
- 激活状态：`active:bg-brand-700` 和 `active:scale-95`
- 触摸友好：`min-h-[44px] min-w-[120px]`
- 圆角：`rounded-lg`
- 平滑过渡：`transition-all duration-200`

**使用场景：**
- 发送申请材料
- 提交表单
- 重要确认操作

**示例：**
```html
<a href="/action" class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]">
  主要操作
  <svg class="w-5 h-5 ml-2">...</svg>
</a>
```

### 2. 次要按钮 (Secondary Button)
用于"查看更多"、"查看全部"等导航操作。

**样式类：**
```html
class="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50 hover:border-brand-800 active:bg-brand-100 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]"
```

**特点：**
- 边框样式：`border-2 border-brand-900`
- 文字颜色：`text-brand-900`
- 悬停状态：`hover:bg-brand-50` 和 `hover:border-brand-800`
- 激活状态：`active:bg-brand-100` 和 `active:scale-95`
- 触摸友好：`min-h-[44px] min-w-[120px]`
- 圆角：`rounded-lg`
- 平滑过渡：`transition-all duration-200`

**使用场景：**
- 查看完整团队
- 查看更多论文
- 查看全部项目
- 其他"查看更多"操作

**示例：**
```html
<a href="/more" class="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50 hover:border-brand-800 active:bg-brand-100 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]">
  查看更多
  <svg class="w-5 h-5 ml-2">...</svg>
</a>
```

### 3. 文本链接 (Text Link)
用于标题旁的"查看全部"链接，保持简洁。

**样式类：**
```html
class="text-brand-900 hover:text-brand-800 font-medium flex items-center transition-colors duration-200"
```

**特点：**
- 纯文本样式
- 品牌色文字：`text-brand-900`
- 悬停状态：`hover:text-brand-800`
- 颜色过渡：`transition-colors duration-200`
- 与图标对齐：`flex items-center`

**使用场景：**
- 新闻动态旁的"查看全部"
- 其他标题旁的导航链接

**示例：**
```html
<a href="/news" class="text-brand-900 hover:text-brand-800 font-medium flex items-center transition-colors duration-200">
  查看全部
  <svg class="w-4 h-4 ml-1">...</svg>
</a>
```

## 图标使用规范

所有按钮中的图标应遵循以下规范：

1. **尺寸：**
   - 主要/次要按钮：`w-5 h-5`
   - 文本链接：`w-4 h-4`

2. **间距：**
   - 主要/次要按钮：`ml-2`
   - 文本链接：`ml-1`

3. **图标：**
   - 向右箭头：`M9 5l7 7-7 7`
   - 发送箭头：`M14 5l7 7m0 0l-7 7m7-7H3`

## 响应式设计

所有按钮都设计为响应式：
- 使用`inline-flex`确保正确对齐
- `min-h-[44px]`确保触摸设备上的可点击区域
- `min-w-[120px]`确保按钮有足够的宽度

## 可访问性

1. **颜色对比度：** 品牌色与白色/背景色有足够的对比度
2. **焦点状态：** 浏览器默认焦点状态已保留
3. **键盘导航：** 所有按钮都可通过键盘访问
4. **触摸目标：** `min-h-[44px]`确保触摸友好

## 实施示例

### 首页按钮统一
```html
<!-- 查看完整团队 -->
<a href="/team" class="inline-flex items-center justify-center px-6 py-3 mb-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50 hover:border-brand-800 active:bg-brand-100 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]">
  查看完整团队
  <svg class="w-5 h-5 ml-2">...</svg>
</a>

<!-- 新闻动态查看全部 -->
<a href="/news" class="text-brand-900 hover:text-brand-800 font-medium flex items-center transition-colors duration-200">
  查看全部
  <svg class="w-4 h-4 ml-1">...</svg>
</a>

<!-- 查看更多论文 -->
<a href="/research" class="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50 hover:border-brand-800 active:bg-brand-100 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]">
  查看更多论文
  <svg class="w-5 h-5 ml-2">...</svg>
</a>

<!-- 查看全部项目 -->
<a href="/research-projects" class="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-50 hover:border-brand-800 active:bg-brand-100 active:scale-95 transition-all duration-200 font-medium text-base min-h-[44px] min-w-[120px]">
  查看全部项目
  <svg class="w-5 h-5 ml-2">...</svg>
</a>
```

## 维护指南

1. **添加新按钮时**：根据操作类型选择合适的按钮样式
2. **修改样式时**：更新此文档和所有相关按钮
3. **代码审查时**：检查按钮样式是否符合规范
4. **设计更新时**：同步更新三种按钮类型

## 版本历史

- **2025-01-12**：创建规范，统一首页按钮样式
- **主要变更**：
  - 将"查看完整团队"从主要按钮改为次要按钮
  - 统一所有"查看更多"操作为次要按钮
  - 标准化文本链接样式
  - 更新联系页面主要按钮样式