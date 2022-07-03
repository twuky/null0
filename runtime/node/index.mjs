// this is a simple tester to load the wasm in node

import { readFile } from 'fs/promises'

const env = {
  null0_log: s => console.log(__liftString(s))
}

const { instance, module } = await WebAssembly.instantiate(await readFile('example/build/simple.wasm'), { env })

// this essentially came from the generated assemblyscript wrapper
function __liftString(pointer) {
  if (!pointer) return null;
  const
    end = pointer + new Uint32Array(instance.exports.memory.buffer)[pointer - 4 >>> 2] >>> 1,
    memoryU16 = new Uint16Array(instance.exports.memory.buffer);
  let
    start = pointer >>> 1,
    string = "";
  while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
  return string + String.fromCharCode(...memoryU16.subarray(start, end));
}

instance.exports.init()