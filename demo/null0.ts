// This is the header

// set the title of the window
@external("env", "pakemon_setTitle")
export declare function setTitle(title: string): void

// load an image
@external("env", "pakemon_loadImage")
export declare function loadImage(location: string): u16

// draw an image
@external("env", "pakemon_drawImage")
export declare function drawImage(image: u16, x: u16, y:u16): void

// clear screen with a color
@external("env", "pakemon_cls")
export declare function cls(color: u32): void

export const B_A = 0
export const B_B = 1
export const B_X = 2
export const B_Y = 2
export const B_L = 2
export const B_R = 2
export const B_START = 2
export const B_SELECT = 2
export const B_LEFT = 2
export const B_RIGHT = 2
export const B_UP = 2
export const B_DOWN = 2