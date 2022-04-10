// this is what a normal game would look like

import * as n from "./null0"

let logo: u16
let x:u16 = 0
let y:u16 = 0

// called initially to load things. they ar enot readable yet
export function init(): void  {
  n.setTitle('null0 demo')
  logo = n.loadImage('assets/logo.png')
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
}

// called when this scene is unloaded
export function destroy(): void {
  console.log('destroy')
}