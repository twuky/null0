// clear screen with a color
@external("env", "null0_cls")
declare function cls(color: u32): void

// set the title of the window
@external("env", "null0_setTitle")
declare function setTitle(title: string): void

// load an image
@external("env", "null0_loadImage")
declare function loadImage(filename: string): u32

// draw an image
@external("env", "null0_drawImage")
declare function drawImage(image: u32, x: i16, y:i16): void

let cat:u32

// called when the cart is loaded
export function init(): void  {
  setTitle('null0 demo')
  cat = loadImage("assets/cat.png")
}

// called on every frame
export function update(delta:u16): void  {
  cls(0x1a1c2cff)
  drawImage(cat, 0, 0);
}
