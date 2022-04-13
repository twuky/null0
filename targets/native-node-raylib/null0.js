import { basename } from 'path'
import { readFile } from 'fs/promises'
import r from 'raylib'

const [, rname, wasmfile] = process.argv

if (!wasmfile) {
  console.error(`Usage: ${basename(rname)} <WASMFILE>`)
  process.exit(1)
}

// get a wasm string from pointer
function getString(pointer) {
  if (!pointer) return null;
  const
    end = pointer + new Uint32Array(wasmModule.instance.exports.memory.buffer)[pointer - 4 >>> 2] >>> 1,
    memoryU16 = new Uint16Array(wasmModule.instance.exports.memory.buffer);
  let
    start = pointer >>> 1,
    string = "";
  while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
  return string + String.fromCharCode(...memoryU16.subarray(start, end));
}


// u16 RGBA to node-raylib color object
const toColor = (num) => {
  num >>>= 0
  const r = ((num & 0xFF000000) >>> 24)
  const g = (num & 0xFF0000) >>> 16
  const b = (num & 0xFF00) >>> 8
  const a = (num & 0xFF)
  return {r, g, b, a}
}


const env = {}

// I dunno if I need to track my own assets, but passing ids didn't seem to work
let a = 0
const assets = {}
const textures = {}
let music

// set the title of the window
env.pakemon_setTitle = (pointer) => r.SetWindowTitle(getString(pointer))

// load an image
env.pakemon_loadImage = (pointer) => {
  a += 1
  assets[a] = r.LoadImage(getString(pointer))
  textures[a] = r.LoadTextureFromImage(assets[a])
  return a
}

// unload an image
env.pakemon_unloadImage = (imageID) => {
  r.UnloadImage(assets[imageID])
  r.UnloadTexture(textures[imageID])
}

// draw an image
env.pakemon_drawImage = (imageID, x, y) => r.DrawTexture(textures[imageID], x, y, r.WHITE)

// resize/scale image (or part of image) and return a new imageID
env.pakemon_modImage = (imageID, sx, sy, sw, sh, dw, dh) => {
  a += 1
  assets[a] = r.ImageFromImage(assets[imageID], {x:sx, y:sy, width:sw, height: sh})
  r.ImageResize(assets[a], dw, dh)
  textures[a] = r.LoadTextureFromImage(assets[a])
  return a
}

env.pakemon_imageDimensions = (imageID) => {
  const { width, height } = assets[imageID]
  return [width, height]
}

// clear screen with a color
env.pakemon_cls = (color) => {
  r.ClearBackground(toColor(color))
}

// load & play a mod music file
env.pakemon_playMusic = filename => {
  music = r.LoadMusicStream(getString(filename))
  r.PlayMusicStream(music)
  music.looping = true
}

// stop the mod music
env.pakemon_stopMusic = () => r.StopMusicStream(music)

env.pakemon_getFPS = () => r.GetFPS()

env.pakemon_drawText = (fontID, text, x, y) => {
  const { size, color, font } = assets[fontID]
  r.DrawTextEx(font,getString(text),{ x, y }, size, 0, color)
  r.DrawText(getString(text), x, y, size, color)
}

env.pakemon_loadFont = (filename, size, color) => {
  a += 1
  const font = r.LoadFont(getString(filename))
  assets[a] = { size, color: toColor(color), font }
  return a
}

// these are assemblyscript things, not sure
env.abort = (...args) => console.log('abort?', args)
env['console.log'] = console.log

const wasmModule = await WebAssembly.instantiate(await readFile(wasmfile), { env })

r.SetTraceLogLevel(r.LOG_ERROR)
r.SetConfigFlags(r.FLAG_VSYNC_HINT)
r.InitWindow(320, 240, 'null0')
r.InitAudioDevice()

// this is not needed with vsync
// r.SetTargetFPS(60)

wasmModule.instance.exports.init()
wasmModule.instance.exports.loaded()

while (!r.WindowShouldClose()) {
  r.UpdateMusicStream(music)
  wasmModule.instance.exports.update()
  r.BeginDrawing()
  wasmModule.instance.exports.draw()
  r.EndDrawing()
}

r.CloseWindow()


