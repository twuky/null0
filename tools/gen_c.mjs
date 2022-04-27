import { readFile } from 'fs/promises'

const iface = JSON.parse(await readFile('interface.json'))

/*
v: void
i: i32
I: i64
f: f32
F: f64
*: i32*
*/

const sigMap = {
    'void': 'v',
    'u32': 'i',
    'u16': 'i',
    'i16': 'i',
    'string': 'F',
    'f64': 'F'
}

const pMap = {
    'string': 'm3ApiGetArgMem(char*',
    'u32': 'm3ApiGetArg(uint32_t',
    'u16': 'm3ApiGetArg(uint16_t',
    'i16': 'm3ApiGetArg(int16_t',
    'f64': 'm3ApiGetArg(float64_t',
    'i32': 'm3ApiGetArg(int32_t'
}

const rMap = {
    'u32': 'uint32_t',
    'u16': 'uint16_t',
    'i16': 'int16_t',
    'f64': 'float64_t',
    'i32': 'int32_t'
}

function sig(f) {
    return `${sigMap[f.returns]}(${Object.values(f.params).map(v => sigMap[v]).join('')})`
}


const content = `
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "raylib.h"
#include "wasm3.h"
#include "m3_env.h"

#define SCREEN_WIDTH (320)
#define SCREEN_HEIGHT (240)

#define FATAL(func, msg) { fprintf(stderr, "Fatal: %s - %s\\n", func, msg); return 1; }

${iface.map(f => {
    return `m3ApiRawFunction(null0_${f.name.replace(/[ \.-]/g, '_')}) {${f.returns === 'void' ? '' : `\n  m3ApiReturnType (${rMap[f.returns]});`}
  ${Object.keys(f.params).map(p => {
    return `${pMap[f.params[p]]}, ${p})` 
}).join('\n  ')}
  ${ f.returns === 'void' ? 'm3ApiSuccess();' : 'm3ApiReturn(0);'  }
}`
}).join('\n\n')}

void LinkNullZeroFunctions(IM3Module module) {
${iface.map(f => {
    const n = `null0_${f.name.replace(/[ \.-]/g, '_')}`
    if (f.internal) {
        return `  m3_LinkRawFunction (module, "env", "${f.name}", "${sig(f)}", &${n});`
    } else {
        return `  m3_LinkRawFunction (module, "env", "null0_${f.name}", "${sig(f)}", &${n});`
    }
}).join('\n')}
}

int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage %s game.wasm\\n", argv[0]);
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
        printf("init: %s\\n", result);
    }

    IM3Function gameUpdate;
    result = m3_FindFunction (&gameUpdate, runtime, "update");
    if ( result ) {
        printf("update: %s\\n", result);
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
`

console.log(content)