
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "raylib.h"
#include "wasm3.h"
#include "m3_env.h"

#define SCREEN_WIDTH (320)
#define SCREEN_HEIGHT (240)

#define FATAL(func, msg) { fprintf(stderr, "Fatal: %s - %s\n", func, msg); return 1; }

m3ApiRawFunction(null0_cls) {
  m3ApiGetArg(uint32_t, color)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_setTitle) {
  m3ApiGetArgMem(char*, title)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_loadImage) {
  m3ApiReturnType (uint16_t);
  m3ApiGetArgMem(char*, filename)
  m3ApiReturn(0);
}

m3ApiRawFunction(null0_drawImage) {
  m3ApiGetArg(uint16_t, image)
  m3ApiGetArg(int16_t, x)
  m3ApiGetArg(int16_t, y)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_imageDimensions) {
  m3ApiReturnType (uint16_t);
  m3ApiGetArg(uint16_t, image)
  m3ApiReturn(0);
}

m3ApiRawFunction(null0_loadMusic) {
  m3ApiReturnType (uint16_t);
  m3ApiGetArgMem(char*, filename)
  m3ApiReturn(0);
}

m3ApiRawFunction(null0_playMusic) {
  m3ApiGetArg(uint16_t, music)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_stopMusic) {
  m3ApiGetArg(uint16_t, music)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_drawSprite) {
  m3ApiGetArg(uint16_t, image)
  m3ApiGetArg(uint16_t, frame)
  m3ApiGetArg(uint16_t, width)
  m3ApiGetArg(uint16_t, height)
  m3ApiGetArg(uint16_t, x)
  m3ApiGetArg(uint16_t, y)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_getFPS) {
  m3ApiReturnType (uint16_t);
  
  m3ApiReturn(0);
}

m3ApiRawFunction(null0_drawText) {
  m3ApiGetArg(uint16_t, font)
  m3ApiGetArgMem(char*, text)
  m3ApiGetArg(int16_t, x)
  m3ApiGetArg(int16_t, y)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_loadFont) {
  m3ApiReturnType (uint16_t);
  m3ApiGetArgMem(char*, filename)
  m3ApiGetArg(uint16_t, size)
  m3ApiGetArg(uint32_t, color)
  m3ApiReturn(0);
}

m3ApiRawFunction(null0_console_log) {
  m3ApiGetArgMem(char*, text)
  printf("%s", text);
  m3ApiSuccess();
}

m3ApiRawFunction(null0_abort) {
  m3ApiGetArgMem(char*, message)
  m3ApiGetArgMem(char*, fileName)
  m3ApiGetArg(uint16_t, lineNumber)
  m3ApiGetArg(uint16_t, columnNumber)
  m3ApiSuccess();
}

m3ApiRawFunction(null0_seed) {
  m3ApiReturnType (float);
  m3ApiReturn(0);
}

int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage %s game.wasm\n", argv[0]);
        return 1;
    }

    IM3Environment env = m3_NewEnvironment ();
    IM3Runtime runtime = m3_NewRuntime (env, 1024, NULL);
    IM3Module module;
    u8* wasm = NULL;
    u32 fsize = 0;
    M3Result result = m3Err_none;
    
    FILE* f = fopen (argv[1], "rb");
    if (!f) FATAL("wasm", "open");
    fseek (f, 0, SEEK_END);
    fsize = ftell(f);
    fseek (f, 0, SEEK_SET);

    if (fsize < 8) {
        FATAL("wasm", "file is too small");
    } else if (fsize > 64*1024*1024) {
        FATAL("wasm", "file is too big");
    }

    wasm = (u8*) malloc(fsize);
    if (!wasm) {
        FATAL("wasm", "cannot allocate memory for wasm binary");
    }

    if (fread (wasm, 1, fsize, f) != fsize) {
        FATAL("wasm", "cannot read file");
    }
    fclose (f);
    f = NULL;

    result = m3_ParseModule (env, &module, wasm, fsize);
    if (result) FATAL("wasm", "cannot parse");
    result = m3_LoadModule (runtime, module);
    if (result) FATAL("wasm", "cannot load");

    m3_LinkRawFunction (module, "env", "null0_cls", "v(i)", &null0_cls);
    m3_LinkRawFunction (module, "env", "null0_setTitle", "v(F)", &null0_setTitle);
    m3_LinkRawFunction (module, "env", "null0_loadImage", "i(F)", &null0_loadImage);
    m3_LinkRawFunction (module, "env", "null0_drawImage", "v(iii)", &null0_drawImage);
    m3_LinkRawFunction (module, "env", "null0_imageDimensions", "undefined(i)", &null0_imageDimensions);
    m3_LinkRawFunction (module, "env", "null0_loadMusic", "i(F)", &null0_loadMusic);
    m3_LinkRawFunction (module, "env", "null0_playMusic", "v(i)", &null0_playMusic);
    m3_LinkRawFunction (module, "env", "null0_stopMusic", "v(i)", &null0_stopMusic);
    m3_LinkRawFunction (module, "env", "null0_drawSprite", "v(iiiiii)", &null0_drawSprite);
    m3_LinkRawFunction (module, "env", "null0_getFPS", "i()", &null0_getFPS);
    m3_LinkRawFunction (module, "env", "null0_drawText", "v(iFii)", &null0_drawText);
    m3_LinkRawFunction (module, "env", "null0_loadFont", "i(Fii)", &null0_loadFont);
    m3_LinkRawFunction (module, "env", "console.log", "v(F)", &null0_console_log);
    m3_LinkRawFunction (module, "env", "abort", "v(FFii)", &null0_abort);
    m3_LinkRawFunction (module, "env", "seed", "F()", &null0_seed);

    IM3Function gameInit;
    result = m3_FindFunction (&gameInit, runtime, "init");
    if ( result ) {
        printf("init: %s\n", result);
    }

    IM3Function gameLoaded;
    result = m3_FindFunction (&gameLoaded, runtime, "loaded");
    if ( result ) {
        printf("loaded: %s\n", result);
    }

    IM3Function gameButtonDown;
    result = m3_FindFunction (&gameButtonDown, runtime, "buttonDown");
    if ( result ) {
        printf("buttonDown: %s\n", result);
    }

    IM3Function gameButtonUp;
    result = m3_FindFunction (&gameButtonUp, runtime, "buttonUp");
    if ( result ) {
        printf("buttonUp: %s\n", result);
    }

    IM3Function gameUpdate;
    result = m3_FindFunction (&gameUpdate, runtime, "update");
    if ( result ) {
        printf("update: %s\n", result);
    }

    SetTraceLogLevel(LOG_ERROR);
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "null0");
    SetTargetFPS(60);

    if (gameInit) {
        m3_CallV (gameInit);
    }

    while (!WindowShouldClose()) {
        BeginDrawing();

        ClearBackground(BLACK);

        if (gameUpdate) {
            m3_CallV (gameUpdate);
        }
        
        EndDrawing();
    }

    CloseWindow();

    return 0;
}

