#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "wasm3.h"
#include "m3_env.h"

static M3Environment* env;
static M3Runtime* runtime;
static M3Module* module;

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

// exports from cart
static M3Function* cart_init;


// imports for cart
// XXX: currently only pruints first character
static m3ApiRawFunction (null0_log) {
  m3ApiGetArgMem(const char*, str);
  printf("%s", str);
  m3ApiSuccess();
}
static m3ApiRawFunction (null0_abort) {
  m3ApiGetArgMem(const char*, message);
  m3ApiGetArgMem(const char*, fileName);
  m3ApiGetArg(int, lineNumber);
  m3ApiGetArg(int, columnNumber);
  char *out;
  sprintf(out, "%s in %s:%d:%d", message, fileName, lineNumber, columnNumber);
  null0_fatal_error("cart", out);
}

// this is the actual run, after all has been loaded
void null0_cart_run () {
  if (cart_init) {
    null0_check_wasm3(m3_CallV(cart_init));
  } else {
    null0_fatal_error("cart", "no init!");
  }
}

// load a wasm binary buffer
void null0_load_cart_wasm (u8* wasmBuffer, int byteLength) {
  env = m3_NewEnvironment();
  runtime = m3_NewRuntime (env, 1024, NULL);
  null0_check_wasm3(m3_ParseModule (env, &module, wasmBuffer, byteLength));
  null0_check_wasm3(m3_LoadModule(runtime, module));

  // imports for cart
  m3_LinkRawFunction(module, "env", "null0_log", "v(i)", &null0_log);
  m3_LinkRawFunction(module, "env", "abort", "v(iiii)", &null0_abort);
  null0_check_wasm3_is_ok();

  // exports from cart
  m3_FindFunction(&cart_init, runtime, "init");
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
  null0_cart_run();
}


int main (int argc, char **argv) {
  null0_load_cart_file(argv[1]);
  return 0;
}

