// This is the header for using null0 in assemblyscript

export const B_A = 0
export const B_B = 1
export const B_X = 3
export const B_Y = 4
export const B_L = 5
export const B_R = 6
export const B_START = 7
export const B_SELECT = 8
export const B_LEFT = 9
export const B_RIGHT = 10
export const B_UP = 11
export const B_DOWN = 12

// https://lospec.com/palette-list/sweetie-16
// totally optional: just nice colors to use when you need one
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

// clear screen with a color
@external("env", "null0_cls")
export declare function cls(color: u32): void

// set the title of the window
@external("env", "null0_setTitle")
export declare function setTitle(title: string): void

// load an image
@external("env", "null0_loadImage")
export declare function loadImage(filename: string): u16

// draw an image
@external("env", "null0_drawImage")
export declare function drawImage(image: u16, x: i16, y:i16): void

// get height/width for an image
@external("env", "null0_imageDimensions")
export declare function imageDimensions(image: u16): Array<u16>(2)

// load a mod music file
@external("env", "null0_loadMusic")
export declare function loadMusic(filename: string): u16

// load a mod music file
@external("env", "null0_playMusic")
export declare function playMusic(music: u16): void

// stop the mod music
@external("env", "null0_stopMusic")
export declare function stopMusic(music: u16): void

// draw a single frame from a spritesheet
@external("env", "null0_drawSprite")
export declare function drawSprite(image: u16, frame: u16, width:u16, height:u16, x:u16, y:u16): void

// get the frames-per-second
@external("env", "null0_getFPS")
export declare function getFPS(): u16

// draw text on the screen
@external("env", "null0_drawText")
export declare function drawText(font:u16, text:string, x:i16, y: i16): void

// draw text on the screen
@external("env", "null0_loadFont")
export declare function loadFont(filename:string, size: u16, color: u32): u16

