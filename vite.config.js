import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa' // 1. Import plugin


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "localhost",
    port: 3000,
  },
});
VitePWA({
      registerType: 'autoUpdate', // Tự động cập nhật khi có nội dung mới
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'QuickBlog',
        short_name: 'QuickBlog',
        description: 'Là 1 trang tạo blog nhanh chóng và dễ dàng',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-logo.png', // Bạn phải chuẩn bị icon này trong thư mục public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-logo.png', // Bạn phải chuẩn bị icon này trong thư mục public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
