#!/usr/bin/env python3

# pip3 install pywasm3 raylib nuitka
# python3 -m nuitka --onefile --linux-onefile-icon assets/logo.png null0.py

import wasm3

env = wasm3.Environment()
rt  = env.new_runtime(1024)
mod = env.parse_module(open("../../build/debug.wasm","rb").read())
rt.load(mod)


def null0_cls(color):
  pass
mod.link_function("env", "null0_cls", null0_cls)


def null0_setTitle(title):
  pass
mod.link_function("env", "null0_setTitle", null0_setTitle)


def null0_loadImage(filename):
  return 0
mod.link_function("env", "null0_loadImage", null0_loadImage)


def null0_drawImage(image,x,y):
  pass
mod.link_function("env", "null0_drawImage", null0_drawImage)


def null0_imageDimensions(image):
  return [0,0]
mod.link_function("env", "null0_imageDimensions", null0_imageDimensions)


def null0_loadMusic(filename):
  return 0
mod.link_function("env", "null0_loadMusic", null0_loadMusic)


def null0_playMusic(music):
  pass
mod.link_function("env", "null0_playMusic", null0_playMusic)


def null0_stopMusic(music):
  pass
mod.link_function("env", "null0_stopMusic", null0_stopMusic)


def null0_drawSprite(image,frame,width,height,x,y):
  pass
mod.link_function("env", "null0_drawSprite", null0_drawSprite)


def null0_getFPS():
  return 0
mod.link_function("env", "null0_getFPS", null0_getFPS)


def null0_drawText(font,text,x,y):
  pass
mod.link_function("env", "null0_drawText", null0_drawText)


def null0_loadFont(filename,size,color):
  return 0
mod.link_function("env", "null0_loadFont", null0_loadFont)


def console_log(text):
  print(text)
mod.link_function("env", "console.log", console_log)


def abort(message,fileName,lineNumber,columnNumber):
  pass
mod.link_function("env", "abort", abort)


def seed():
  pass
mod.link_function("env", "seed", seed)

gameInit = rt.find_function("init")
gameInit()

gameUpdate = rt.find_function("update")
gameUpdate()