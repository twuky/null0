// this is the web implementation of the null0 API for web

/* global WebAssembly, Image, FontFace */
/* eslint-disable camelcase */

import { Modplayer, PlayerProtracker, PlayerScreamtracker, PlayerFasttracker } from 'https://unpkg.com/@crossaudio/mod@0.1.22/dist/crossaudio-mod.module.js'

let ctx

// used to calculate FPS
let oldtime = 0
let newtime = 0
let delta = 1

// asset system
// I start with 1 item, so 0 is "not loaded" not a position in the assets array
const assets = [undefined]
let resourceLoaded

// since we have to click-to-play sounds, I use this to hold them
const pendingMusic = {}

// load an image, return a promise
const _loadImage = url => new Promise(resolve => {
  const i = new Image()
  i.onload = () => resolve(i)
  i.src = url
})

// load a font dynamically to document, return a promise
const _loadFont = async (url, name) => {
  const face = await new FontFace(name, `url(${url})`)
  document.fonts.add(face)
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

// clear screen with a color - void
export function cls (color) {
  // console.log('cls', { color })
}

// set the title of the window - void
export function setTitle (title) {
  document.title = title
}

// load an image - u16
export function loadImage (filename) {
  const a = assets.length
  console.log('loadImage', { a, filename })
  assets.push(undefined)
  _loadImage(filename).then(i => {
    assets[a] = i
    resourceLoaded(a)
  })
  return a
}

// draw an image - void
export function drawImage (image, x, y) {
  if (!image || !assets[image]) {
    return
  }
  if (x < 0) {
    x = 320 + x
  }
  if (y < 0) {
    y = 240 + x
  }

  // console.log('drawImage', { image, x, y })
}

// get height/width for an image - Array<u16>(2)
export function imageDimensions (image) {
  if (!image || !assets[image]) {
    return [0, 0]
  }
  return [assets[image].width, assets[image].height]
}

// load a mod music file - u16
export function loadMusic (filename) {
  const a = assets.length
  assets.push(undefined)

  pendingMusic[a] = {
    playing: false,
    filename,
    player: new Modplayer({ mod: PlayerProtracker, s3m: PlayerScreamtracker, xm: PlayerFasttracker })
  }

  console.log('loadMusic', { a, filename })
  return a
}

// load a mod music file - u16
export function playMusic (music) {
  if (pendingMusic[music]) {
    pendingMusic[music].playing = true
  }
  if (assets[music]) {
    assets[music].play()
  }
}

// stop the mod music - void
export function stopMusic (music) {
  if (pendingMusic[music]) {
    pendingMusic[music].playing = false
  }
  if (assets[music]) {
    assets[music].stop()
  }
}

// load a spritesheet - u16
export function loadSprites (image, height, width) {
  if (!image) {
    return
  }
  const a = assets.length
  assets.push(undefined)
  console.log('loadSprites', { a, image, height, width })
  return a
}

// stop the mod music - u16
export function getFPS () {
  return (1 / (delta / 1000)) | 0
}

// draw text on the screen - void
export function drawText (font, text, x, y) {
  if (!font || !assets[font]) {
    return
  }
  if (x < 0) {
    x = 320 + x
  }
  if (y < 0) {
    y = 240 + x
  }

  const { size, color, name } = assets[font]

  ctx.fillStyle = 'red'
  ctx.font = `${size}px ${name}`
  ctx.fillText('Hello world', x, y)

  // console.log('drawText', { font, text, x, y })
}

// draw text on the screen - u16
export function loadFont (filename, size, color) {
  const a = assets.length
  const name = `font${a}`
  console.log('loadFont', { a, name, filename, size, color })
  assets.push(undefined)
  _loadFont(filename, name).then(() => {
    assets[a] = { size, color, name }
    resourceLoaded(a)
  })
  return a
}

export default async function setup (wasmBytes, canvas) {
  ctx = canvas.getContext('2d')

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
      null0_loadSprites (image, height, width) {
        return loadSprites(image >>> 0, height >>> 0, width >>> 0)
      },
      null0_null0_stopMusic (music) {
        stopMusic(music >>> 0)
      },
      null0_imageDimensions (image) {
        return imageDimensions(image >>> 0)
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

  resourceLoaded = exports.loaded || (() => {})

  document.addEventListener('keydown', e => {
    e.preventDefault()
    if (typeof keyMap[e.code] !== 'undefined') {
      exports.buttonDown(keyMap[e.code])
    }
  })

  document.addEventListener('keyup', e => {
    e.preventDefault()
    if (typeof keyMap[e.code] !== 'undefined') {
      exports.buttonUp(keyMap[e.code])
    }
  })

  // since audio is click-to-play, loop through them and move them into place
  document.addEventListener('click', async () => {
    for (const id of Object.keys(pendingMusic)) {
      const { playing, filename, player } = pendingMusic[id]
      await player.loadUrl(filename)
      if (playing) {
        player.play()
      }
      assets[id] = player
      delete pendingMusic[id]
      resourceLoaded(id)
    }
  }, { once: true })

  if (exports.init) {
    exports.init(newtime)
  }

  const doUpdate = () => {
    oldtime = newtime
    newtime = window.performance.now()
    delta = newtime - oldtime

    if (exports.update) {
      exports.update(delta)
    }

    window.requestAnimationFrame(doUpdate)
  }
  doUpdate()
}
