/* global performance, WebAssembly */

import { basename } from 'path'
import { readFile } from 'fs/promises'
import r from 'raylib'
import { MaintainFPS } from './async.js'

// asset system
// I start with 1 item, so 0 is "not loaded" not a position in the assets array
const assets = [undefined]
const music = []
let resourceLoaded

// u16 RGBA to node-raylib color object
const _toColor = (num) => {
  num >>>= 0
  const r = ((num & 0xFF000000) >>> 24)
  const g = (num & 0xFF0000) >>> 16
  const b = (num & 0xFF00) >>> 8
  const a = (num & 0xFF)
  return { r, g, b, a }
}

export const keyMap = {
  KeyZ: 0, // A
  KeyX: 1, // B
  KeyA: 3, // X
  KeyS: 4, // Y
  KeyQ: 5, // L
  KeyW: 6, // R
  Enter: 7, // START
  Tab: 8, // SELECT
  ArrowLeft: 9, // LEFT
  ArrowRight: 10, // RIGHT
  ArrowUp: 11, // UP
  ArrowDown: 12 // DOWN
}

export const palette = [
  0x1a1c2cff,
  0x5d275dff,
  0xb13e53ff,
  0xef7d57ff,
  0xffcd75ff,
  0xa7f070ff,
  0x38b764ff,
  0x257179ff,
  0x29366fff,
  0x3b5dc9ff,
  0x41a6f6ff,
  0x73eff7ff,
  0xf4f4f4ff,
  0x94b0c2ff,
  0x566c86ff,
  0x333c57ff
]

// get FPS
export function getFPS () {
  return r.GetFPS()
}

// clear screen with a color - void
export function cls (color) {
  r.ClearBackground(_toColor(color))
}

// set the title of the window - void
export function setTitle (title) {
  r.SetWindowTitle(title)
}

// load an image - u16
export function loadImage (filename) {
  const a = assets.length
  assets.push(undefined)
  setTimeout(() => {
    const image = r.LoadImage(filename)
    const texture = r.LoadTextureFromImage(image)
    assets[a] = { image, texture }
    resourceLoaded(a)
  }, 0)
  return a
}

// draw an image - void
export function drawImage (imageID, x, y) {
  r.DrawTexture(assets[imageID].texture, x, y, r.WHITE)
}

// get height/width for an image - Array<u16>(2)
export function imageDimensions (imageID) {
  const { width, height } = assets[imageID].image
  return [width, height]
}

// load a mod music file - u16
export function loadMusic (filename) {
  const a = assets.length
  assets.push(undefined)
  setTimeout(() => {
    assets[a] = r.LoadMusicStream(filename)
    assets[a].looping = true
    music.push(a)
    resourceLoaded(a)
  }, 0)
  return a
}

// load a mod music file - u16
export function playMusic (musicID) {
  r.PlayMusicStream(assets[musicID])
}

// stop the mod music - void
export function stopMusic (musicID) {
  r.StopMusicStream(assets[musicID])
}

// draw a single frame from a spritesheet
export function drawSprite (imageID, frame, width, height, x, y) {
  // TODO
}

// draw text on the screen - void
export function drawText (fontID, text, x, y) {
  const { size, color, font } = assets[fontID]
  r.DrawTextEx(font, text, { x, y }, size, 0, color)
}

// draw text on the screen - u16
export function loadFont (filename, size, color) {
  const a = assets.length
  assets.push(undefined)
  setTimeout(() => {
    const font = r.LoadFont(filename)
    assets[a] = { size, color: _toColor(color), font }
    resourceLoaded(a)
  }, 0)
  return a
}

export default async function setup (wasmBytes) {
  const { exports } = await WebAssembly.instantiate(await WebAssembly.compile(wasmBytes), {
    env: {
      null0_setTitle (title) {
        setTitle(__liftString(title >>> 0))
      },
      null0_loadFont (filename, size, color) {
        return loadFont(__liftString(filename >>> 0), size, color >>> 0)
      },
      null0_loadImage (filename) {
        return loadImage(__liftString(filename >>> 0))
      },
      abort (message, fileName, lineNumber, columnNumber) {
        message = __liftString(message >>> 0)
        fileName = __liftString(fileName >>> 0)
        lineNumber = lineNumber >>> 0
        columnNumber = columnNumber >>> 0;
        (() => {
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`)
        })()
      },
      null0_loadMusic (filename) {
        return loadMusic(__liftString(filename >>> 0))
      },
      null0_playMusic (music) {
        playMusic(music >>> 0)
      },
      'console.log' (text) {
        console.log(__liftString(text >>> 0))
      },
      null0_cls (color) {
        cls(color >>> 0)
      },
      null0_drawText (font, text, x, y) {
        drawText(font, __liftString(text >>> 0), x, y)
      },
      null0_drawImage (image, x, y) {
        drawImage(image >>> 0, x, y)
      },
      null0_drawSprite (image, frame, width, height, x, y) {
        return drawSprite(image >>> 0, frame >>> 0, width >>> 0, height >>> 0, x >>> 0, y >>> 0)
      },
      null0_null0_stopMusic (music) {
        stopMusic(music >>> 0)
      },
      null0_imageDimensions (image) {
        // sources/assemblyscript/null0/imageDimensions(u16) => ~lib/array/Array<u16>
        return __lowerArray((pointer, value) => { new Uint16Array(memory.buffer)[pointer >>> 1] = value }, 4, 1, imageDimensions(image)) || __notnull()
      },
      seed () {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random()
        })()
      },
      null0_getFPS: getFPS
    }
  })

  const memory = exports.memory
  function __liftString (pointer) {
    if (!pointer) return null
    const end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1
    const memoryU16 = new Uint16Array(memory.buffer)
    let start = pointer >>> 1
    let string = ''
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024))
    return string + String.fromCharCode(...memoryU16.subarray(start, end))
  }

  function __lowerArray (lowerElement, id, align, values) {
    if (values == null) return 0
    const length = values.length
    const buffer = exports.__pin(exports.__new(length << align, 0)) >>> 0
    const header = exports.__pin(exports.__new(16, id)) >>> 0
    const memoryU32 = new Uint32Array(memory.buffer)
    memoryU32[header + 0 >>> 2] = buffer
    memoryU32[header + 4 >>> 2] = buffer
    memoryU32[header + 8 >>> 2] = length << align
    memoryU32[header + 12 >>> 2] = length
    for (let i = 0; i < length; ++i) lowerElement(buffer + (i << align >>> 0), values[i])
    exports.__unpin(buffer)
    exports.__unpin(header)
    return header
  }

  // ha!
  function __notnull () {
    throw TypeError('value must not be null')
  }

  resourceLoaded = exports.loaded || (() => {})

  r.SetTraceLogLevel(r.LOG_ERROR)
  // r.SetConfigFlags(r.FLAG_VSYNC_HINT)
  r.InitWindow(320, 240, 'null0')
  r.InitAudioDevice()

  if (exports.init) {
    exports.init()
  }

  while (await MaintainFPS(60)) {
    for (const m of music) {
      r.UpdateMusicStream(assets[m])
    }

    r.BeginDrawing()
    exports.update()
    r.EndDrawing()
  }

  r.CloseWindow()
}

/***********************************************************/

const [, rname, wasmfile] = process.argv
if (!wasmfile) {
  console.error(`Usage: ${basename(rname)} <WASMFILE>`)
  process.exit(1)
}

readFile(wasmfile).then(bytes => setup(bytes))
