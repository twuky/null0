// this is what a normal game would look like

import * as n from "./null0"

let logo: u16
let cat: u16
let font: u16
let catsprites: Array<u16>
let x:u16 = 0
let y:u16 = 0
let catframe:u16 = 0

// called initially to load things. they ar enot readable yet
export function init(): void  {
  n.setTitle('null0 demo')
  font = n.loadFont('assets/likeraylib.ttf', 8, 0xffffffff)
  logo = n.loadImage('assets/logo.png')
  cat = n.loadImage('assets/cat.png')
  catsprites = [
    n.modImage(cat, 0, 192, 32, 32, 32, 32),
    n.modImage(cat, 32, 192, 32, 32, 32, 32),
    n.modImage(cat, 64, 192, 32, 32, 32, 32),
    n.modImage(cat, 96, 192, 32, 32, 32, 32),
    n.modImage(cat, 128, 192, 32, 32, 32, 32),
    n.modImage(cat, 160, 192, 32, 32, 32, 32),
  ]
  n.playMusic('assets/the_golden_ages.mod')
}

// called after all assets are loaded from init()
export function loaded(): void  {
}

// called whenever a button goes down
export function buttonDown(button:u8): void {
  console.log('buttonDown: ' + button.toString())
}

// called whever a button goes up
export function buttonUp(button:u8): void {
  console.log('buttonUp: ' + button.toString())
}

// called before every draw
export function update(): void  {
  y += 1
  y = y % 240
  x += 1
  x = x % 320

  // increment the cat frame every 30th frame
  if (y % 30 == 0) {
    catframe += 1
    catframe = catframe % <u16>catsprites.length
  }
}

// called on every frame
export function draw(): void {
  n.cls(n.palette[0])

  n.drawImage(logo, x-100, y-100)
  n.drawImage(logo, 320-x-100, 240-y-100)
  n.drawImage(logo, 320-x-100, y-100)
  n.drawImage(logo, x-100, 240-y-100)
  n.drawImage(logo, x-y, y-x)
  n.drawImage(logo, 320-x-y, 240-y-x)
  n.drawImage(logo, 320-x-y, y-x)
  n.drawImage(logo, x-y, 240-y-x)
  n.drawText(font, n.getFPS().toString(), 10, 20)

  n.drawImage(catsprites[catframe], 0, y)
  n.drawImage(catsprites[catframe], 50, (y * 6) % 240)
  n.drawImage(catsprites[catframe], 100, (y * 5) % 240)
  n.drawImage(catsprites[catframe], 150, (y * 4) % 240)
  n.drawImage(catsprites[catframe], 200, (y * 3) % 240)
  n.drawImage(catsprites[catframe], 250, (y * 2) % 240)
}

// called when this scene is unloaded
export function destroy(): void {
  console.log('destroy')
}