import { Page } from 'puppeteer-core'

export default async function bot({ page }: { page: Page }): Promise<void> {
  try {
    await page.goto('https://www.github.com/1001josias')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await page.screenshot({ path: process.cwd() + `/${Math.random() * 100}-screenshot.png` })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(330)) {
      await page.mouse.wheel({ deltaY: 3 })
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    await page.close()
  } catch (error) {
    console.error(error)
  }
}
