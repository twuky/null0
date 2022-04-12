// this exposes the null0 api as a native module

#include <stddef.h>
#include <stdio.h>
#include <string.h>

#include "quickjs.h"
#include "cutils.h"
#include "raylib.h"

static JSValue rl_init_window(JSContext* ctx, JSValueConst this_val, int argc, JSValueConst* argv)
{
  int w, h;
  const char* title = NULL;

  if (JS_ToInt32(ctx, &w, argv[0]))
    return JS_EXCEPTION;
  
  if (JS_ToInt32(ctx, &h, argv[1]))
    return JS_EXCEPTION;

  title = JS_ToCString(ctx, argv[2]);
  if (title == NULL)
    return JS_EXCEPTION;

  InitWindow(w, h, title);

  return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_rl_funcs[] = {
  JS_CFUNC_DEF("initWindow", 3, rl_init_window),
};

static int js_rl_init(JSContext* ctx, JSModuleDef* m)
{

  return JS_SetModuleExportList(ctx, m, js_rl_funcs, countof(js_rl_funcs));
}

JSModuleDef* js_init_module(JSContext* ctx, const char* module_name)
{
  JSModuleDef* m;
  m = JS_NewCModule(ctx, module_name, js_rl_init);
  
  if (!m)
    return NULL;
  
  JS_AddModuleExportList(ctx, m, js_rl_funcs, countof(js_rl_funcs));

  return m;
}