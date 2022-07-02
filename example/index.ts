// assemblyscript example

// log a string
@external("env", "null0_log")
declare function log(message: string): void


export function init(): void  {
  log("init")
}

