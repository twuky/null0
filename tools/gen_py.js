import { readFile } from 'fs/promises'

const iface = JSON.parse(await readFile('interface.json'))

console.log(iface.map(f => {
return `
def ${f.internal ? f.name : `null0_${f.name}`}(${Object.keys(f.params).join(',')}):
  pass
mod.link_function("env", "${f.name}", ${f.internal ? f.name : `null0_${f.name}`})
`
}).join('\n'))