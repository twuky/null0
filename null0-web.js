// this is the web implementation of the null0 API

/* global Image */

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

globalThis.pakemon_setTitle = (title) => {
  document.title = title
}

globalThis.pakemon_loadImage = (location) => {
  a++
  assets[a] = loadImage(location)
  return a
}

globalThis.pakemon_drawImage = (imageID, x, y) => {
  assets[imageID].then(i => ctx.drawImage(i, x, y))
}

globalThis.pakemon_cls = (color) => {
  const c = toColor(color)
  console.log(color, c)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = c
  ctx.fill()
}

export default async function setup (cnv, minigame) {
  canvas = cnv
  ctx = cnv.getContext('2d')

  // call into wasm for game-loop

  if (minigame.init) {
    minigame.init()
  }

  function doUpdate () {
    minigame.update()
    window.requestAnimationFrame(doUpdate)
  }

  function doDraw () {
    minigame.draw()
    window.requestAnimationFrame(doDraw)
  }

  if (minigame.update) {
    doUpdate()
  }

  if (minigame.draw) {
    doDraw()
  }
}
