import { Page } from 'puppeteer-core'

export default async function bot({ page }: { page: Page }): Promise<void> {
  try {
    await page.goto('https://www.github.com/1001josias')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await page.screenshot({ path: process.cwd() + `/${Math.random() * 100}-screenshot.png` })
    await page.close()
  } catch (error) {
    console.error(error)
  }
}
