# null0

This is a very simple cross-platform (including web, and fast native) game library that uses wasm on all platforms (compile once and distribute.) It takes inspiration from love2d and wasm4, but it's way less complete. Initially, it will just be a demo project for building your own stuff, but I hope to make a CLI tool for getting started quick, and maybe a libretro core and a few modules you can optionally use (networking for example.)

You can think of it as a "fantasy console", but it's not nearly as constrained or complete as other really awesome ones, like wasm4, TIC80, etc. If you want something more like a gameboy, try wasm4 or TIC80. If you want a complete game library, try raylib (with many native language bindings) or love2d (fun, lua-based wrapper around SDL, that is easy to work with, if you don't need anything else.)

You can see the current demo [here](https://null0.surge.sh/).

# features

- sound - audio-files & mod-music
- graphics - 320x240, any colors, driven by images/sprites, not really shapes/pixels/etc
- input - mapped from keys & joystick, A, B, X, Y, L, R, start, select, digital directional

You can write your games in any language that compiles to wasm (simialr to wasm4, where you import the header for the language you prefer.)

One idea is to setup fast/easy dev in a browser, then later you can use that same wasm file with a native runtime.

Currently, I am putting it all together, so it's mostly just a demo/dev project. You can install deps with `npm i`, and all the tasks are setup as top-level `npm run` tasks:

```sh
# build the example wasm game (written in assemblyscript)
npm run build:example

# build the native C runtime
npm run build:native

# Build & run the example in the native runtime
npm test
```