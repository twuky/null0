# null0

Short for "notnull". This is a very simple cross-platform (including web, and fast native) game library that uses wasm on all platforms (compile once and distribute.) It takes inspiration from love2d and wasm4, but it's way less complete. Initially, it will just be a demo project for building your own stuff, but I hope to make a CLI tool for getting started quick, and maybe a libretro core and a few modules you can optionally use (networking for example.)

You can think of it as a "fantasy console", but it's not nearly as constrained or complete as other really awesome ones, like TIC80. If you want something more like a gameboy, try wasm4 or TIC80. If you want a complete game library, try raylib (with many native language indings) or love2d (fun, lua-based wrapper around SDL, that is easy to work with, if you don't need anything else.)

You can see the current demo [here](https://null0.surge.sh/).


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

## how it works

The idea is that you have a few "targets" (platforms that your game will run on) and "sources" (languages you write your game in.) Any "source" will work with any "target", so you can develop on a reloading web-target, while working on stuff, and then release your game as a wasm file (or embedded runtime, like love does) that can run on any target.

### targets

- web - still working on API, but this will be completed first
- native - once the web is complete for basic games, I will start with raylib, in some language I like (probly node first, then maybe nim)

### source

- assemblyscript - this will be the first header completed, since I like it a lot
- nim - no work on this yet, but it is planned
- C/C++ - no work on this yet, but it is planned
- rust - no work on this yet, but it is planned
- nelua - no work on this yet, but it is planned
- zig - no work on this yet, but it is planned


## todo

- basic web API prototype & tooling for live-reloading on web
- same API in native runtime (using raylib) Not sure what to use for native, myabe nim?
- opengl/webgl - this would greatly improve performance, I think
- more supported "source" headers
- libretro core "target"
