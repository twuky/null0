> **NOT COMPLETE** I am using this to hold ideas for the future. I'm not sure I want to even target a non-wasm runtime

This is a demo of a custom runtime that will load your null0 js source, and run it. It doesn't use wasm games or anything else. 

All runtimes have trade-offs. This is a native library for quickjs, so you will need to install that runtime. You write your code in js, which you can compile to standalone code with `qjsc`

If you like js, and intend to distribute a compiled game (not share your wasm rom with others) this might be useful. 