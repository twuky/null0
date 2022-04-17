// this is what a normal game might look like

import {
  cls,
  drawText,
  getFPS,
  loadFont,
  loadImage,
  loadMusic,
  palette,
  playMusic,
  setTitle,
  imageDimensions,
  drawImage,
  drawSprite
} from "../../sources/assemblyscript/null0"

let logo: u16

let catImage: u16
let cat: u16
const catFrames = [36, 37, 38, 39, 40, 41]
let catFrame = 0

let font: u16

let music: u16

let fps = ''
let counter = 0
let direction = 0.0

// called initially to load things. they ar enot readable yet
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
    console.log('font loaded.')
  }
  if (resource === logo) {
    const d = imageDimensions(logo)
    console.log('logo loaded. width:' + d[0].toString() + ' height:' + d[1].toString())
  }
  if (resource === catImage) {
    const d = imageDimensions(catImage)
    console.log('catImage loaded. width:' + d[0].toString() + ' height:' + d[1].toString())
  }
  if (resource === cat) {
    console.log('cat sprite loaded.')
  }
  if (resource === music) {
    console.log('music loaded.')
    playMusic(music)
  }
}

// called whenever a button goes down
export function buttonDown(button:u8): void {
  console.log('buttonDown: ' + button.toString())
}

// called whever a button goes up
export function buttonUp(button:u8): void {
  console.log('buttonUp: ' + button.toString())
}

// called on every frame
export function update(delta:u16): void  {
  // would be cool to use delta, but this seems to work better for animations
  counter += 1

  if (counter % 5 === 0) {
    fps = getFPS().toString()
  }

  if (counter % 10 === 0) {
    catFrame += 1
  }

  cls(palette[0])

  const x = <u16>counter % 320
  const y = <u16>counter % 240

  if (x === 0) {
    direction = Math.floor(Math.random() * 2)
  }

  if (y === 0) {
    direction = Math.floor(Math.random() * 2) + 2
  }

  if (direction === 0) {
    drawImage(logo, x, y)
  }
  if (direction === 1) {
    drawImage(logo, x, 240-y)
  }
  if (direction === 2) {
    drawImage(logo, 320-x, y)
  }
  if (direction === 3) {
    drawImage(logo, 320-x, 240-y)
  }
  
  drawSprite(catImage, <u16>catFrames[catFrame % catFrames.length] , 32, 32, 100, 200)
  drawSprite(catImage, <u16>catFrames[(catFrame + 2) % catFrames.length] , 32, 32, 200, 200)
  drawSprite(catImage, <u16>catFrames[(catFrame + 3) % catFrames.length] , 32, 32, 160, 200)

  // negative numbers go to the other side!
  drawText(font, fps, -30, 20)
}

