# null0

Short for "notnull". This is a very simple cross-platform (inluding web, and fast native) game library that uses wasm on all platforms (compile once and distribute.) It takes inspiration from love2d and wasm4, but it's way less complete. Initially, it will just be a demo project for building your own stuff, but I hope to make a CLI tool for getting started quick, and maybe a libretro core and a few modules you can optionally use (networking for example.)

You can think of it as a "fantasy console", but it's not nearly as constrained or complete as other really awesome ones, like TIC80. If you want something more like a gameboy, try wasm4 or TIC80. If you want a complete game library, try raylib (with many native bindings) or love2d (fun, lua-based wrapper around SDL.)


## specs

- sound - audio-files & mod-music
- graphics - 320x240, any colors, driven by images, not really shapes/pixels/etc
- input - mapped from keys & joystick, A, B, X, Y, L, R, start, select, digital directional

You can write your games in any language that compiles to wasm (simialr to wasm4, where you import the header for the language you prefer) but I don't have the headers setup for anything other than asemblyscript, now, so that is how this project works.

The idea is fast/easy dev in a browser, then later you can use that same wasm file with a native runtime.

## usage

```sh
# watch for changes and refresh
npm start

# build a release version of the wasm
npm run build:release
```

## todo

- basic web API prototype & tooling for live-reloading
- same in native runtime (using raylib)