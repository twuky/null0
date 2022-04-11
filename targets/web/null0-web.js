// this is the web implementation of the null0 API for web

/* global Image, performance, Canvas */

// TODO: would wegbl be better? https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html

export const B_A = 0
export const B_B = 1
export const B_X = 2
export const B_Y = 2
export const B_L = 2
export const B_R = 2
export const B_START = 2
export const B_SELECT = 2
export const B_LEFT = 2
export const B_RIGHT = 2
export const B_UP = 2
export const B_DOWN = 2

const loadImage = url => new Promise(resolve => {
  const i = new Image()
  i.onload = () => resolve(i)
  i.src = url
})

// u16 RGBA to rgba color string
const toColor = (num) => {
  num >>>= 0
  const r = ((num & 0xFF000000) >>> 24)
  const g = (num & 0xFF0000) >>> 16
  const b = (num & 0xFF00) >>> 8
  const a = (num & 0xFF) / 255
  return 'rgba(' + [r, g, b, a].join(',') + ')'
}

const fonts = {}
let ctx
let canvas
const assets = {}
let a = 0

let oldtime = 0
let newtime = 0
let fps = 0

// set the title of the window
globalThis.pakemon_setTitle = (title) => {
  document.title = title
}

// load an image
globalThis.pakemon_loadImage = (location) => {
  a++
  ;(async () => {
    assets[a] = loadImage(location)
  })()
  return a
}

// unload an image
globalThis.pakemon_unloadImage = (imageID) => {
  delete assets[imageID]
}

// draw an image
globalThis.pakemon_drawImage = (imageID, x, y) => {
  if (assets[imageID]) {
    if (assets[imageID] instanceof Promise) {
      ;(async () => {
        ctx.drawImage(await assets[imageID], x, y)
      })()
    } else {
      ctx.drawImage(assets[imageID], x, y)
    }
  }
}

// resize/scale image (or part of image) and return a new imageID
globalThis.pakemon_modImage = (imageID, sx, sy, sw, sh, dw, dh) => {
  a += 1
  const mya = a

  ;(async () => {
    const offscreen = document.createElement('canvas')
    offscreen.width = dw
    offscreen.height = dh
    const octx = offscreen.getContext('2d')
    octx.drawImage(await assets[imageID], sx, sy, sw, sh, 0, 0, dw, dh)
    assets[mya] = await loadImage(offscreen.toDataURL())
  })()

  return a
}

globalThis.pakemon_imageDimensions = (imageID) => {
  if (assets[imageID]) {
    return [assets[imageID].width, assets[imageID].height]
  }
  return [0, 0]
}

// clear screen with a color
globalThis.pakemon_cls = (color) => {
  const c = toColor(color)
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = c
  ctx.fill()
}

const music = new globalThis.Modplayer()
let musicFilename
let musicClick = false

// load & play a mod music file
globalThis.pakemon_playMusic = filename => {
  if (musicClick) {
    music.autostart = true
    music.load(filename)
  } else {
    musicFilename = filename
  }
}

// stop the mod music
globalThis.pakemon_stopMusic = () => {
  music.stop()
  music.autostart = false
}

globalThis.pakemon_getFPS = () => fps

globalThis.pakemon_drawText = (font, text, x, y) => {
  const { color, size, name } = assets[font]
  ctx.beginPath()
  ctx.font = `${size}px ${name}`
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.fill()
}

globalThis.pakemon_loadFont = (filename, size, color) => {
  a += 1
  const name = `font${a}`
  assets[a] = {
    color: toColor(color),
    size,
    name
  }
  fonts[filename] = name
  const s = document.createElement('style')
  s.textContent = `@font-face {
      font-family: font${a};
      src: url("${filename}");
    }`
  document.getElementsByTagName('head')[0].appendChild(s)
  return a
}

export default async function setup (cnv, minigame) {
  canvas = cnv
  ctx = cnv.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // call into wasm for game-loop

  if (minigame.init) {
    minigame.init()
  }

  // audio is click-to-start
  cnv.onclick = async () => {
    if (!musicClick) {
      musicClick = true
      music.autostart = true
      if (musicFilename) {
        music.load(musicFilename)
      }
    }
  }

  for (const i of Object.keys(assets)) {
    assets[i] = await assets[i]
  }

  if (minigame.loaded) {
    minigame.loaded()
  }

  function doUpdate () {
    if (minigame.update) {
      minigame.update()
    }
    oldtime = newtime
    newtime = performance.now()
    if (Math.round(newtime) % 10 === 0) {
      fps = Math.round(1 / ((newtime - oldtime) / 1000))
    }

    if (minigame.draw) {
      minigame.draw()
    }
    window.requestAnimationFrame(doUpdate)
  }
  doUpdate()
}
