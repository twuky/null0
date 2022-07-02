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
  imageDimensions,
  drawImage,
  drawSprite
} from "../target/assemblyscript/null0"

export function init(): void  {
  log("init")
}

export function update(delta:u16): void {
  // log('update: ' + delta.toString())
}

export function loaded(resource:u16):void {
  // log('loaded: ' + resource.toString())
}

export function buttonDown(button:u8): void {
  // log('buttonDown: ' + button.toString())
}

export function buttonUp(button:u8): void {
  // log('buttonUp: ' + button.toString())
}
