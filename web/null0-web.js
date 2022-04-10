// this is the web implementation of the null0 API for web

/* global Image, performance, AudioWorkletNode, OffscreenCanvas */

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
  const a = (num & 0xFF) / 255
  const b = (num & 0xFF00) >>> 8
  const g = (num & 0xFF0000) >>> 16
  const r = ((num & 0xFF000000) >>> 24)
  return 'rgba(' + [r, g, b, a].join(',') + ')'
}

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
  assets[a] = loadImage(location)
  return a
}

// unload an image
globalThis.pakemon_unloadImage = (imageID) => {
  delete assets[imageID]
}

// draw an image
globalThis.pakemon_drawImage = (imageID, x, y) => {
  if (assets[imageID]) {
    ctx.drawImage(assets[imageID], x, y)
  }
}

// resize/scale image (or part of image) and return a new imageID
// TODO: finish this
globalThis.pakemon_modImage = (imageID, sx, sy, sw, sh, dx, dy, dw, dh) => {
  if (!assets[imageID]) {
    return
  }
  const offscreen = new OffscreenCanvas(sx + dw + dx, sy + dh + dy)
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
    minigame.update()
    oldtime = newtime
    newtime = performance.now()
    if (Math.round(newtime) % 10 === 0) {
      fps = Math.round(1 / ((newtime - oldtime) / 1000))
    }
    window.requestAnimationFrame(doUpdate)
  }

  function doDraw () {
    minigame.draw()
    // TODO: use a bitmap font by default
    ctx.font = '8px "Acme 9"'
    ctx.fillStyle = 'white'
    ctx.fillText(fps.toString(), 1, 11)
    window.requestAnimationFrame(doDraw)
  }

  if (minigame.update) {
    doUpdate()
  }

  if (minigame.draw) {
    doDraw()
  }
}
