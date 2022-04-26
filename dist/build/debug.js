async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      null0_setTitle(title) {
        // sources/assemblyscript/null0/setTitle(~lib/string/String) => void
        title = __liftString(title >>> 0);
        null0_setTitle(title);
      },
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      null0_loadFont(filename, size, color) {
        // sources/assemblyscript/null0/loadFont(~lib/string/String, u16, u32) => u16
        filename = __liftString(filename >>> 0);
        color = color >>> 0;
        return null0_loadFont(filename, size, color);
      },
      null0_loadImage(filename) {
        // sources/assemblyscript/null0/loadImage(~lib/string/String) => u16
        filename = __liftString(filename >>> 0);
        return null0_loadImage(filename);
      },
      null0_loadMusic(filename) {
        // sources/assemblyscript/null0/loadMusic(~lib/string/String) => u16
        filename = __liftString(filename >>> 0);
        return null0_loadMusic(filename);
      },
      "console.log"(text) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.log(text);
      },
      null0_imageDimensions(image) {
        // sources/assemblyscript/null0/imageDimensions(u16) => ~lib/array/Array<u16>
        return __lowerArray((pointer, value) => { new Uint16Array(memory.buffer)[pointer >>> 1] = value; }, 4, 1, null0_imageDimensions(image)) || __notnull();
      },
      null0_cls(color) {
        // sources/assemblyscript/null0/cls(u32) => void
        color = color >>> 0;
        null0_cls(color);
      },
      null0_drawText(font, text, x, y) {
        // sources/assemblyscript/null0/drawText(u16, ~lib/string/String, i16, i16) => void
        text = __liftString(text >>> 0);
        null0_drawText(font, text, x, y);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerArray(lowerElement, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 0)) >>> 0,
      header = exports.__pin(exports.__new(16, id)) >>> 0,
      memoryU32 = new Uint32Array(memory.buffer);
    memoryU32[header + 0 >>> 2] = buffer;
    memoryU32[header + 4 >>> 2] = buffer;
    memoryU32[header + 8 >>> 2] = length << align;
    memoryU32[header + 12 >>> 2] = length;
    for (let i = 0; i < length; ++i) lowerElement(buffer + (i << align >>> 0), values[i]);
    exports.__unpin(buffer);
    exports.__unpin(header);
    return header;
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return exports;
}
export const {
  init,
  loaded,
  buttonDown,
  buttonUp,
  update
} = await (async url => instantiate(
  await (
    typeof globalThis.fetch === "function"
      ? WebAssembly.compileStreaming(globalThis.fetch(url))
      : WebAssembly.compile(await (await import("node:fs/promises")).readFile(url))
  ), {
  }
))(new URL("debug.wasm", import.meta.url));
