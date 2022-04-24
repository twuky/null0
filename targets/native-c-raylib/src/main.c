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

m3ApiRawFunction(m3_cls) {
    m3ApiGetArg (uint32_t, color)
    printf("color: %d\n", color);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_setTitle) {
    m3ApiGetArgMem (char *, title)
    printf("title: %s\n", title);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_loadImage) {
    m3ApiReturnType (uint16_t);
    m3ApiGetArgMem (char *, filename)
    printf("image: %s\n", filename);
    m3ApiReturn(0);
}

m3ApiRawFunction(m3_loadFont) {
    m3ApiReturnType (uint16_t);
    m3ApiGetArgMem (char *, filename)
    printf("font: %s\n", filename);
    m3ApiReturn(0);
}

m3ApiRawFunction(m3_loadMusic) {
    m3ApiReturnType (uint16_t);
    m3ApiGetArgMem (char *, filename)
    printf("music: %s\n", filename);
    m3ApiReturn(0);
}

m3ApiRawFunction(m3_drawImage) {
    m3ApiGetArg (uint32_t, imageID)
    m3ApiGetArg (uint32_t, x)
    m3ApiGetArg (uint32_t, y)
    printf("draw: %d\n", imageID);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_imageDimensions) {
    m3ApiReturnType (uint16_t);
    m3ApiGetArg (uint32_t, imageID)
    printf("dimensions: %d\n", imageID);
    m3ApiReturn(0);
}

m3ApiRawFunction(m3_playMusic) {
    m3ApiGetArg (uint16_t, musicID)
    printf("play: %d\n", musicID);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_stopMusic) {
    m3ApiGetArg (uint16_t, musicID)
    printf("stop: %d\n", musicID);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_drawSprite) {
    m3ApiGetArg (uint16_t, imageID)
    m3ApiGetArg (uint16_t, frame)
    m3ApiGetArg (uint16_t, width)
    m3ApiGetArg (uint16_t, height)
    m3ApiGetArg (uint16_t, x)
    m3ApiGetArg (uint16_t, y)
    printf("sprite: %d %d %d %d %d %d\n", imageID, frame, width, height, x, y);
    m3ApiSuccess();
}

m3ApiRawFunction(m3_getFPS) {
    m3ApiReturnType (uint16_t);
    printf("fps\n");
    m3ApiReturn(0);
}

m3ApiRawFunction(m3_drawText) {
    m3ApiGetArgMem (uint16_t, fontID)
    m3ApiGetArgMem (char *, text)
    m3ApiGetArgMem (uint16_t, x)
    m3ApiGetArgMem (uint16_t, y)
    printf("text: %d %s %d %d\n", fontID, text, x, y);
    m3ApiSuccess();
}

void LinkNullZeroFunctions(IM3Module module){
    m3_LinkRawFunction (module, "env", "null0_cls", "v(i)", &m3_cls);
    m3_LinkRawFunction (module, "env", "null0_setTitle", "v(i)", &m3_setTitle);
    m3_LinkRawFunction (module, "env", "null0_loadImage", "i(i)", &m3_loadImage);
    m3_LinkRawFunction (module, "env", "null0_loadFont", "i(i)", &m3_loadFont);
    m3_LinkRawFunction (module, "env", "null0_loadMusic", "i(i)", &m3_loadMusic);
    m3_LinkRawFunction (module, "env", "null0_drawImage", "v(iii)", &m3_drawImage);
    m3_LinkRawFunction (module, "env", "null0_imageDimensions", "i(i)", &m3_imageDimensions);
    m3_LinkRawFunction (module, "env", "null0_playMusic", "v(i)", &m3_playMusic);
    m3_LinkRawFunction (module, "env", "null0_stopMusic", "v(i)", &m3_stopMusic);
    m3_LinkRawFunction (module, "env", "null0_drawSprite", "v(iiiiii)", &m3_drawSprite);
    m3_LinkRawFunction (module, "env", "null0_getFPS", "i()", &m3_getFPS);
    m3_LinkRawFunction (module, "env", "null0_drawText", "v(iiii)", &m3_drawText);
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

    LinkNullZeroFunctions(module);

    IM3Function gameInit;
    result = m3_FindFunction (&gameInit, runtime, "init");
    if ( result ) {
        printf("init: %s\n", result);
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
