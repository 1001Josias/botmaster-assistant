import * as path from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'

const processes = fs.readdirSync('src/bots', { recursive: true, withFileTypes: true })
const rollupOptionsInput = processes.reduce(
  (structuredData, file) => {
    if (file.isDirectory()) return {}
    const isValidFileName = ['index.ts', 'bot.ts', 'process.ts'].includes(file.name)
    const filePath = `${file.path}/${file.name}`
    return isValidFileName
      ? { ...structuredData, [`bots/${path.basename(file.path)}`]: path.resolve(filePath) }
      : structuredData
  },
  {} as unknown as Record<string, string>
)

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],

    build: {
      rollupOptions: {
        output: {
          extend: true
        },
        input: {
          index: path.resolve('src/main/index.ts'),
          ...rollupOptionsInput
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': path.resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
