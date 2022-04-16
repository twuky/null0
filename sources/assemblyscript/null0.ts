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
// just nice colors to use when you need one
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
@external("env", "pakemon_cls")
export declare function cls(color: u32): void

// set the title of the window
@external("env", "pakemon_setTitle")
export declare function setTitle(title: string): void

// load an image
@external("env", "pakemon_loadImage")
export declare function loadImage(filename: string): u16

// unload an image
@external("env", "pakemon_unloadImage")
export declare function unloadImage(image: u16): void

// draw an image
@external("env", "pakemon_drawImage")
export declare function drawImage(image: u16, x: u16, y:u16): void

// get height/width for an image
@external("env", "pakemon_imageDimensions")
export declare function imageDimensions(image: u16): Array<u16>(2)

// load a mod music file
@external("env", "pakemon_playMusic")
export declare function playMusic(filename: string): u16

// stop the mod music
@external("env", "pakemon_stopMusic")
export declare function stopMusic(): void

// resize/scale image (or part of image) and return a new imageID
@external("env", "pakemon_modImage")
export declare function modImage(image: u16, sx: u16, sy: u16, sw: u16, sh: u16, dw: u16, dh: u16): u16

// stop the mod music
@external("env", "pakemon_getFPS")
export declare function getFPS(): u16

// draw text on the screen
@external("env", "pakemon_drawText")
export declare function drawText(font:u16, text:string, x:u16, y: u16): u16


// draw text on the screen
@external("env", "pakemon_loadFont")
export declare function loadFont(filename:string, size: u16, color: u32): u16
