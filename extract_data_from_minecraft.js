const promisify = require('util').promisify
const downloadServer = promisify(require('minecraft-wrap').downloadServer)
const fs = require('fs').promises
const { once } = require('events')
const { spawn } = require('child_process')
async function main () {
  try { await fs.mkdir('minecraft_extracted_data') } catch (e) {}
  await downloadServer('1.18', 'minecraft_extracted_data/server.jar')
  const process = spawn('java -DbundlerMainClass=net.minecraft.data.Main -jar server.jar')
  process.on('message', (msg) => {
    console.log(msg)
  })
  await once(process, 'exit')
  console.log('done')
}

main()
