const promisify = require('util').promisify
const downloadServer = promisify(require('minecraft-wrap').downloadServer)
const fs = require('fs').promises
const { execSync } = require('child_process')
const path = require('path')
const mcData = require('minecraft-data')
const OUT_DIR = 'minecraft_extracted_data'
const rm = async path => fs.rm(path, { force: true, recursive: true })
module.exports = async (version) => {
  try { await fs.mkdir(OUT_DIR) } catch (e) {}
  try { await rm('server.jar') } catch (e) {}
  await downloadServer(version, path.join(OUT_DIR, 'server.jar'))
  const isNewerThan118 = mcData(version).isNewerOrEqualTo('1.18')
  const cliStartCommand = isNewerThan118 ? `java -DbundlerMainClass=net.minecraft.data.Main -jar ${path.join(OUT_DIR, 'server.jar')}` : `java -cp ${path.join(OUT_DIR, 'server.jar')} net.minecraft.data.Main`
  const output = execSync(`${cliStartCommand} --reports`).toString()
  if (!output.includes('All providers took:')) {
    console.log('Server dumping failed, output printed:')
    console.log(output)
  }
  try {
    await fs.rename(path.join('generated', 'reports', 'blocks.json'), path.join(OUT_DIR, 'minecraft_generated_blocks.json'))
    await rm('generated')
    await rm('libraries')
    await rm('logs')
    await rm(path.join(OUT_DIR, 'server.jar'))
  } catch (e) {}
}
