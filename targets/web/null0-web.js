// web-based target for null0
// use setup(wasmExports, canvas) to start things

// ideas from here: would wegbl be better? https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html

/* eslint camelcase: 0 */
/* global Image */

let wasmMemory
let gl
const assets = {}
let a = 0
let fps = 0
const music = new globalThis.Modplayer()
let musicFilename

// get a wasm string from pointer
function getString (pointer) {
  if (!pointer) {
    return null
  }
  const end = pointer + new Uint32Array(wasmMemory.buffer)[pointer - 4 >>> 2] >>> 1
  const memoryU16 = new Uint16Array(wasmMemory.buffer)
  let start = pointer >>> 1
  let string = ''
  while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024))
  return string + String.fromCharCode(...memoryU16.subarray(start, end))
}

// u16 RGBA to node-raylib color object
function toColor (num) {
  num >>>= 0
  const r = ((num & 0xFF000000) >>> 24) / 255
  const g = ((num & 0xFF0000) >>> 16) / 255
  const b = ((num & 0xFF00) >>> 8) / 255
  const a = (num & 0xFF) / 255
  return { r, g, b, a }
}

export async function setup (exports, canvas) {
  wasmMemory = exports.memory
  gl = canvas.getContext('webgl')

  if (exports.init) {
    exports.init()
  }

  // load initial stuff
  for (const i of Object.keys(assets)) {
    assets[i] = await assets[i]
  }

  if (exports.loaded) {
    exports.loaded()
  }

  function doUpdate () {
    if (exports.update) {
      exports.update()
    }

    fps = 0

    if (exports.draw) {
      exports.draw()
    }
    window.requestAnimationFrame(doUpdate)
  }
  doUpdate()

  // audio is click-to-start
  canvas.addEventListener('click', () => {
    music.autostart = true
    if (musicFilename) {
      music.load(musicFilename)
    }
  }, { once: true })

  const handleResize = () => {
    if (window.innerHeight > window.innerWidth) {
      canvas.className = 'portrait'
    } else {
      canvas.className = 'landscape'
    }
  }

  window.addEventListener('resize', handleResize)
  handleResize()
}

// set the title of the window
export function pakemon_setTitle (pointer) {
  document.title = getString(pointer)
}

// load an image
export function pakemon_loadImage (pointer) {
  a += 1

  return a
}

// unload an image
export function pakemon_unloadImage (imageID) {
  delete assets[imageID]
}

// draw an image
export function pakemon_drawImage (imageID, x, y) {
}

// resize/scale image (or part of image) and return a new imageID
export function pakemon_modImage (imageID, sx, sy, sw, sh, dw, dh) {
  a += 1

  return a
}

// get height/width for an image
export function pakemon_imageDimensions (imageID) {
}

// clear screen with a color
export function pakemon_cls (color) {
  const { r, g, b, a } = toColor(color)
  gl.clearColor(r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

// load & play a mod music file
export function pakemon_playMusic (filename) {
  a += 1

  return a
}

// stop the mod music
export function pakemon_stopMusic () {
}

export function pakemon_getFPS () {
  return fps
}

export function pakemon_drawText (font, text, x, y) {
}

export function pakemon_loadFont (filename, size, color) {
  a += 1

  return a
}
