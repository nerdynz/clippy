'use strict'

import { app, BrowserWindow, ipcMain, clipboard, globalShortcut } from 'electron'
import FlexSearch from 'flexsearch'
const exClip = require('electron-clipboard-extended')
const Datastore = require('nedb')
const db = new Datastore({ filename: './clips.nedb', autoload: true })
const osascript = require('node-osascript')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let lastWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    transparent: true,
    show: false
  // titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('search', (event, arg) => {
    doSearch(arg)
  // event.reply('current-docs', ['one', 'two', 'three'])
  })

  ipcMain.on('insert', (event, clip) => {
    clipboard.writeText(clip.text)
    mainWindow.hide()
    swapToWindow(lastWindow, (result, err) => {
      if (err) {
        console.error(err)
      }
      sendPaste((result, err) => {
        console.log(result, err)
      })
    })
  })
}

const mainHotkey = 'CommandOrControl+Shift+b'

app.dock.hide()
app.on('ready', () => {
  createWindow()

  let ret = globalShortcut.register(mainHotkey, () => {
    onMainPressed()
  })
  if (!ret || !globalShortcut.isRegistered(mainHotkey)) {
    console.error('failed to register')
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  updateDocsOnRender()
})

const index = new FlexSearch()

exClip.on('text-changed', () => {
  let currentText = exClip.readText()
  let currentHtml = exClip.readHTML()
  db.insert({
    text: currentText,
    html: currentHtml,
    dt: new Date()
  }, (err, newClip) => {
    if (err) {
      console.error(err)
      return
    }
    index.add(newClip._id, currentText)
    updateDocsOnRender()
  })
}).startWatching()

function updateDocsOnRender () {
  db.find({}).sort({dt: -1}).limit(20).exec((err, docs) => {
    if (err) {
      console.error(err)
      sendDocsToRender([])
      return
    }
    sendDocsToRender(docs)
  })
}

function doSearch (searchText) {
  if (!searchText) {
    updateDocsOnRender()
    return
  }
  let results = index.search(searchText)
  db.find({_id: { $in: results }}).sort({dt: -1}).limit(20).exec((err, docs) => {
    if (err) {
      sendDocsToRender([])
      return
    }
    sendDocsToRender(docs)
  })
}

function sendDocsToRender (docs) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('current-docs', docs)
  }
}

function sendPaste (callback) {
  osascript.execute(`
tell application "System Events" to keystroke "v" using command down
`, {}, (err, result, raw) => {
    if (callback) {
      callback(result, err)
    }
  })
}

function swapToWindow (window, callback) {
  osascript.execute(`
tell application "System Events"
  set frontmost of first process where the name is "${window}" to true
end tell
    `, {}, (err, result, raw) => {
    if (callback) {
      callback(result, err)
    }
  })
}

function saveWindowBeforeActive (callback) {
  osascript.execute(`
  tell application "System Events" 
    get the name of first process where it is frontmost 
  end tell
`, {}, (err, result, raw) => {
    if (callback) {
      callback(result, err)
    }
  })
}

function onMainPressed () {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    saveWindowBeforeActive((result) => {
      lastWindow = result
      mainWindow.show()
    })
  }
}
