module.exports = {
  content: ["./src/**/*.{astro,html,md,js,ts}"],
  theme: {
    extend: {
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
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
}
