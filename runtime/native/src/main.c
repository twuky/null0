
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "wasm3.h"
#include "m3_env.h"
#include "raylib.h"
#include "rlunicode.h"

static M3Environment* env;
static M3Runtime* runtime;
static M3Module* module;

#define B_A 0
#define B_B 1
#define B_X 3
#define B_Y 4
#define B_L 5
#define B_R 6
#define B_START 7
#define B_SELECT 8
#define B_LEFT 9
#define B_RIGHT 10
#define B_UP 11
#define B_DOWN 12

// throw a fatal error
static void null0_fatal_error(char* func, char* msg) {
  fprintf(stderr, "FATAL: %s - %s\n", func, msg);
  exit(1);
}

// all wasm3 functions return same sort of error-pattern, so this wraps that
static void null0_check_wasm3 (M3Result result) {
  if (result) {
    M3ErrorInfo info;
    m3_GetErrorInfo(runtime, &info);
    char *message;
    sprintf(message, "%s - %s", result, info.message);
    null0_fatal_error("wasm", message);
  }
}

// this checks the general state of the runtime, to make sure there are no errors lingering
static void null0_check_wasm3_is_ok () {
  M3ErrorInfo error;
  m3_GetErrorInfo(runtime, &error);
  if (error.result) {
    char *message;
    sprintf(message, "%s - %s", error.result, error.message);
    null0_fatal_error("wasm", message);
  }
}

// IMPORTS

// Fatal error
static m3ApiRawFunction (null0_abort) {
  m3ApiGetArgMem(const uint16_t *, _smessage);
  char message[1024];
  ConvertUTF16ToUTF8(_smessage, message);
  m3ApiGetArgMem(const uint16_t *, _sfileName);
  char fileName[1024];
  ConvertUTF16ToUTF8(_sfileName, fileName);
  m3ApiGetArg(uint16_t, lineNumber);
  m3ApiGetArg(uint16_t, columnNumber);
  char* msg;
  sprintf(msg, "%s at %s:%d:%d", message, fileName, lineNumber, columnNumber);
  null0_fatal_error("cart", msg);
  m3ApiSuccess();
}

// Clear screen with a color
static m3ApiRawFunction (null0_cls) {
  m3ApiGetArg(uint32_t, color);
  ClearBackground(GetColor(color));
  m3ApiSuccess();
}


// Set the title of the window
static m3ApiRawFunction (null0_setTitle) {
  m3ApiGetArgMem(const uint16_t *, _stitle);
  char title[1024];
  ConvertUTF16ToUTF8(_stitle, title);
  SetWindowTitle(title);
  m3ApiSuccess();
}


// Load an image
static m3ApiRawFunction (null0_loadImage) {
  m3ApiReturnType (uint32_t*);
  m3ApiGetArgMem(const uint16_t *, _sfilename);

  char filename[1024];
  ConvertUTF16ToUTF8(_sfilename, filename);

  // TODO
  printf("LOAD %s", filename);

  // void* ptr = MemAlloc(sizeof(Texture2D));
  // *(Texture2D*)ptr = LoadTexture("assets/cat.png");
  m3ApiReturn(0);
}


// Draw an image
static m3ApiRawFunction (null0_drawImage) {
  m3ApiGetArgMem(uint32_t*, image);

  m3ApiGetArg(int16_t, x);
  m3ApiGetArg(int16_t, y);

  // TODO
  printf("DRAW: %d - %d,%d", image, x, y);

  // Texture2D texture = *(Texture2D*) image;
  // DrawTexture(texture, x, y, WHITE);

  m3ApiSuccess();
}


// Get width for an image
static m3ApiRawFunction (null0_imageWidth) {
  m3ApiReturnType (uint16_t);
  uint16_t retval;
  m3ApiGetArgMem(const uint64_t *, image);

  // CODE GOES HERE

  m3ApiReturn(retval);
}


// Get height for an image
static m3ApiRawFunction (null0_imageHeight) {
  m3ApiReturnType (uint16_t);
  uint16_t retval;
  m3ApiGetArg(uint64_t, image);

  // CODE GOES HERE

  m3ApiReturn(retval);
}


// Load a mod music file
static m3ApiRawFunction (null0_loadMusic) {
  m3ApiReturnType (uint64_t);
  uint16_t retval;
  m3ApiGetArgMem(const uint16_t *, _sfilename);
  char filename[1024];
  ConvertUTF16ToUTF8(_sfilename, filename);

  // CODE GOES HERE

  m3ApiReturn(retval);
}


// Load a mod music file
static m3ApiRawFunction (null0_playMusic) {
  m3ApiGetArg(uint64_t, music);

  // CODE GOES HERE

  m3ApiSuccess();
}


// Stop the mod music
static m3ApiRawFunction (null0_stopMusic) {
  m3ApiGetArg(uint64_t, music);

  // CODE GOES HERE

  m3ApiSuccess();
}


// Draw a single frame from a spritesheet
static m3ApiRawFunction (null0_drawSprite) {
  m3ApiGetArg(uint64_t, image);
  m3ApiGetArg(uint16_t, frame);
  m3ApiGetArg(uint16_t, width);
  m3ApiGetArg(uint16_t, height);
  m3ApiGetArg(uint16_t, x);
  m3ApiGetArg(uint16_t, y);

  // CODE GOES HERE

  m3ApiSuccess();
}


// Get the frames-per-second
static m3ApiRawFunction (null0_getFPS) {
  m3ApiReturnType (uint16_t);
  uint16_t retval;

  // CODE GOES HERE

  m3ApiReturn(retval);
}


// Draw text on the screen
static m3ApiRawFunction (null0_drawText) {
  m3ApiGetArg(uint64_t, font);
  m3ApiGetArgMem(const uint16_t *, _stext);
  char text[1024];
  ConvertUTF16ToUTF8(_stext, text);
  m3ApiGetArg(int16_t, x);
  m3ApiGetArg(int16_t, y);

  // CODE GOES HERE

  m3ApiSuccess();
}


// Draw text on the screen
static m3ApiRawFunction (null0_loadFont) {
  m3ApiReturnType (uint64_t);
  uint64_t retval;
  m3ApiGetArgMem(const uint16_t *, _sfilename);
  char filename[1024];
  ConvertUTF16ToUTF8(_sfilename, filename);
  m3ApiGetArg(uint16_t, size);
  m3ApiGetArg(uint32_t, color);

  // CODE GOES HERE

  m3ApiReturn(retval);
}


// Log a string
static m3ApiRawFunction (null0_log) {
  m3ApiGetArgMem(const uint16_t *, _stext);
  char text[1024];
  ConvertUTF16ToUTF8(_stext, text);
  printf("%s", text);
  m3ApiSuccess();
}


// EXPORTS
static M3Function* cart_init;
static M3Function* cart_update;
static M3Function* cart_loaded;
static M3Function* cart_buttonUp;
static M3Function* cart_buttonDown;

// load a wasm binary buffer
void null0_load_cart_wasm (u8* wasmBuffer, int byteLength) {
  env = m3_NewEnvironment();
  runtime = m3_NewRuntime (env, 1024, NULL);
  null0_check_wasm3(m3_ParseModule (env, &module, wasmBuffer, byteLength));
  null0_check_wasm3(m3_LoadModule(runtime, module));

  // IMPORTS
  m3_LinkRawFunction(module, "env", "null0_cls", "v(i)", &null0_cls);
  m3_LinkRawFunction(module, "env", "null0_setTitle", "v(i)", &null0_setTitle);
  m3_LinkRawFunction(module, "env", "null0_loadImage", "i(i)", &null0_loadImage);
  m3_LinkRawFunction(module, "env", "null0_drawImage", "v(iii)", &null0_drawImage);
  m3_LinkRawFunction(module, "env", "null0_imageWidth", "i(i)", &null0_imageWidth);
  m3_LinkRawFunction(module, "env", "null0_imageHeight", "i(i)", &null0_imageHeight);
  m3_LinkRawFunction(module, "env", "null0_loadMusic", "i(i)", &null0_loadMusic);
  m3_LinkRawFunction(module, "env", "null0_playMusic", "v(i)", &null0_playMusic);
  m3_LinkRawFunction(module, "env", "null0_stopMusic", "v(i)", &null0_stopMusic);
  m3_LinkRawFunction(module, "env", "null0_drawSprite", "v(iiiiii)", &null0_drawSprite);
  m3_LinkRawFunction(module, "env", "null0_getFPS", "i()", &null0_getFPS);
  m3_LinkRawFunction(module, "env", "null0_drawText", "v(iiii)", &null0_drawText);
  m3_LinkRawFunction(module, "env", "null0_loadFont", "i(iii)", &null0_loadFont);
  m3_LinkRawFunction(module, "env", "null0_log", "v(i)", &null0_log);
  m3_LinkRawFunction(module, "env", "abort", "v(iiii)", &null0_abort);
  
  null0_check_wasm3_is_ok();

  // EXPORTS
  m3_FindFunction(&cart_init, runtime, "init");
  m3_FindFunction(&cart_update, runtime, "update");
  m3_FindFunction(&cart_loaded, runtime, "loaded");
  m3_FindFunction(&cart_buttonUp, runtime, "buttonUp");
  m3_FindFunction(&cart_buttonDown, runtime, "buttonDown");
}

// load a binary wasm file
void null0_load_cart_file (char* filename) {
  u8* wasm = NULL;
  int fsize = 0;
  
  FILE* f = fopen (filename, "rb");
  if (!f) null0_fatal_error("file", "open - Cannot open file.");
  fseek (f, 0, SEEK_END);
  fsize = ftell(f);
  fseek (f, 0, SEEK_SET);

  if (fsize < 8) {
    null0_fatal_error("file", "size - File is too small.");
  } else if (fsize > 64*1024*1024) {
    null0_fatal_error("file", "size - File is too big.");
  }

  wasm = (u8*) malloc(fsize);
  if (!wasm) {
    null0_fatal_error("file", "memory - Cannot allocate memory for wasm binary.");
  }

  if (fread (wasm, 1, fsize, f) != fsize) {
    null0_fatal_error("file", "read - Cannot read file.");
  }
  fclose (f);
  f = NULL;

  null0_load_cart_wasm(wasm, fsize);
}

int main (int argc, char **argv) {
  null0_load_cart_file(argv[1]);
  
  // disable raylib debugging
  // SetTraceLogLevel(LOG_ERROR);

  InitWindow(320, 240, "null0");
  SetTargetFPS(60);
  
  if (cart_init) {
    null0_check_wasm3(m3_CallV(cart_init));
  } else {
    null0_fatal_error("cart", "no init!");
  }

  while (!WindowShouldClose()) {
    BeginDrawing();
    if (cart_update) {
      m3_CallV (cart_update, 0);
    }
    EndDrawing();
  }
  CloseWindow();

  return 0;
}

