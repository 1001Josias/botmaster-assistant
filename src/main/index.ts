/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path'
import pie from 'puppeteer-in-electron'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/botmaster.png?asset'
import { getProcesses } from './utils'
import { BotMasterUtilities } from '../types'
import puppeteer from 'puppeteer-extra'

const processes = getProcesses()
const webSocketPort = 9222

// app.commandLine.appendSwitch('headless', 'new')
// app.commandLine.appendSwitch('ignore-gpu-blacklist')

app.commandLine.appendSwitch('remote-allow-origins', `http://127.0.0.1:${webSocketPort}`)

function createWindow(): BrowserWindow {
  const headlessMode = ['new']
  const hasSwitchHeadless = app.commandLine.hasSwitch('headless')
  const headless = app.commandLine.getSwitchValue('headless')
  const isHeadless = hasSwitchHeadless && headlessMode.includes(headless)

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    // frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    !isHeadless && mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('process-list', processes)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

pie
  .initialize(app, webSocketPort)
  .then(async () => {
    await app.whenReady()
    createWindow()

    // http://127.0.0.1:9222/json
    // http://localhost:9222/json/version

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('run-process', async (event, process) => {
      const window = new BrowserWindow({
        show: false,
        title: 'BotMaster Process'
        // fullscreen: false,
      })
      let processFinalizationMessage
      try {
        // @ts-ignore
        const browser = await pie.connect(app, puppeteer)

        const page = await pie.getPage(browser, window)

        window.webContents.debugger.attach('1.3')
        const mainWebContents =
          await window.webContents.debugger.sendCommand('Target.getTargetInfo')
        window.webContents.debugger.detach()
        console.log(
          `http://127.0.0.1:9222/devtools/inspector.html?ws=127.0.0.1:9222/devtools/page/${mainWebContents.targetInfo.targetId}`
        )

        // @ts-ignore
        const botMaster = new BotMasterUtilities(page)

        const { default: runProcess } = await import(process.path)
        console.log(`${process.key} started`)
        await runProcess(botMaster)
        processFinalizationMessage = `${process.key} completed`
      } catch (error: unknown) {
        processFinalizationMessage = `${process.key} failed with message:`
        console.error(error)
        event.reply(
          `${process.key}-finished`,
          `${processFinalizationMessage} ${error instanceof Error ? error.message : error}`
        )
      } finally {
        event.reply(`${process.key}-finished`, processFinalizationMessage)
        console.log(processFinalizationMessage)
        window?.destroy()
      }
    })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .catch(console.log)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
