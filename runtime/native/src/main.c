#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "wasm3.h"
#include "m3_env.h"

#define FATAL(func, msg) { fprintf(stderr, "Fatal: %s - %s\n", func, msg); return 1; }

m3ApiRawFunction(null0_log) {
  m3ApiGetArgMem(char*, text)
  printf("%s", text);
  m3ApiSuccess();
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

  m3_LinkRawFunction (module, "env", "null0_log", "v(i)", &null0_log);

  IM3Function gameInit;
  result = m3_FindFunction (&gameInit, runtime, "init");
  if ( result ) {
    FATAL("init", result);
  }
  if (gameInit) {
    m3_CallV (gameInit);
  }
}
