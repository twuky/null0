// assemblyscript example

import {
  log,
  cls,
  drawText,
  getFPS,
  loadFont,
  loadImage,
  loadMusic,
  palette,
  playMusic,
  setTitle,
  imageWidth,
  imageHeight,
  drawImage,
  drawSprite
} from "../sources/assemblyscript/null0"

let logo: u16

let catImage: u16
let cat: u16
const catFrames = [36, 37, 38, 39, 40, 41]
let catFrame = 0

let font: u16

let music: u16

let fps = ''
let counter = 0

let x:i16 = 0
let y:i16 = 0

let xSpeed:i16 = 1
let ySpeed:i16 = 1

// called when the cart is loaded
export function init(): void  {
  setTitle('null0 demo')
  font = loadFont('assets/likeraylib.ttf', 8, palette[4])
  logo = loadImage('assets/logo.png')
  catImage = loadImage('assets/cat.png')
  music = loadMusic('assets/the_golden_ages.mod')
}

// called when a resource is loaded
export function loaded(resource:u16):void {
  if (resource === font) {
    log('font loaded.')
  }
  if (resource === logo) {
    const w = imageWidth(logo)
    const h = imageHeight(logo)
    log('logo loaded. width:' + w.toString() + ' height:' + h.toString())
  }
  if (resource === catImage) {
    const w = imageWidth(catImage)
    const h = imageHeight(catImage)
    log('catImage loaded. width:' + w.toString() + ' height:' + h.toString())
  }
  if (resource === cat) {
    log('cat sprite loaded.')
  }
  if (resource === music) {
    log('music loaded.')
    playMusic(music)
  }
}

// called whenever a button goes down
export function buttonDown(button:u8): void {
  log('buttonDown: ' + button.toString())
}

// called whever a button goes up
export function buttonUp(button:u8): void {
  log('buttonUp: ' + button.toString())
}

// called on every frame
export function update(delta:u16): void  {
  // would be cool to use delta, but this seems to work better for animations
  counter += 1

  if (counter % 10 === 0) {
    fps = getFPS().toString()
  }

  if (counter % 20 === 0) {
    catFrame += 1
  }

  cls(palette[0])

  x = x + xSpeed
  y = y + ySpeed

  if (x > 280) {
    xSpeed = -1
  }

  if (x < 0) {
    xSpeed = 1
  }

  if (y > 200) {
    ySpeed = -1
  }

  if (y < 0) {
    ySpeed = 1
  }

  drawImage(logo, x, y)
  
  drawSprite(catImage, <u16>catFrames[catFrame % catFrames.length] , 32, 32, 100, 200)
  drawSprite(catImage, <u16>catFrames[(catFrame + 2) % catFrames.length] , 32, 32, 200, 200)
  drawSprite(catImage, <u16>catFrames[(catFrame + 3) % catFrames.length] , 32, 32, 160, 200)

  // negative numbers go to the other side!
  drawText(font, fps, -30, 20)
}
