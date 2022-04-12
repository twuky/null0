This is a fast proof-of-concept using node-raylib.

Eventually, I will write the native runtime in something that makes a much smaller/faster file, like nim or rust, or C. This is just to try out the idea of loading wasm cartridges very quickly.

run with `node null0.js ../../build/debug.wasm` after you have built it, in the parent project. 

Normally, a project like this would also have wasm source, and `assemblyscript` included, so you can build the whole thing, but as I said, this is just a POC.