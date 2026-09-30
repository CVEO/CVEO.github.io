/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,md,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        // 中文优先的系统字体栈：Win=雅黑 / macOS=PingFang，数字与英文走 UI 字体
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          // 珞珈蓝 (Luojia Blue) 主色调
          50: "#f5f3ff",
          100: "#e8e4ff",
          200: "#d4cfff",
          300: "#b3a8ff",
          400: "#8f7cff",
          500: "#6b4eff",
          600: "#5a3ce6",
          700: "#4a2dcc",
          800: "#3d25a8",
          900: "#2d1f5c", // 珞珈蓝主色
          // 珞珈绿 (Luojia Green) 辅色调
          green: {
            50: "#f0f9f0",
            100: "#dcf2dc",
            200: "#b8e5b8",
            300: "#8fd48f",
            400: "#6ac06a",
            500: "#4da64d",
            600: "#3d8c3d",
            700: "#327332",
            800: "#2a5f2a",
            900: "#2a4829" // 珞珈绿主色
          }
        },
        // 知识图谱节点语义色（与 KnowledgeGraph.astro 组件内色板保持一致）
        graph: {
          paper: "#c4baff",
          paperFeatured: "#6b4eff",
          paperCollab: "#ffffff",
          repo: "#334155",
          dataset: "#7c3aed",
          award: "#f59e0b",
          project: "#ea580c",
          faculty: "#0d9488"
        }
      },
      // 统一按钮样式配置
      boxShadow: {
        'button': '0 2px 4px rgba(45, 31, 92, 0.1)',
        'button-hover': '0 4px 8px rgba(45, 31, 92, 0.15)',
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
}
