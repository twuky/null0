import * as n from "./null0"

// this is what a normal game would look like

let logo: u16
let x:u16 = 0
let y:u16 = 0

export function init(): void  {
  n.setTitle('Pakémon')
  logo = n.loadImage('assets/logo.png')
}

// export function keyUp(button:u8): void {
//   console.log('keyUp: ' + button.toString())
// }

// export function keyDown(button:u8): void {
//   console.log('keyDown: ' + button.toString())
// }

export function update(): void  {
  y += 1
  y = y % 240

  x += 1
  x = x % 320
}

export function draw(): void {
  n.cls(0x003300ff)
  n.drawImage(logo, x, y)
}

// export function destroy(): void {
//   console.log('destroy')
// }