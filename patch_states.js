const fs = require('fs')
const path = require('path')
const extractDataFromMC = require('./extract_data_from_minecraft')

/**
 * Adds defaultState to blocks.json
 * @param {string} inFile path to the blocks.json
 */

async function handle (version, outPath) {
  const blockFile = path.resolve(outPath)
  const blocks = require(blockFile)
  await extractDataFromMC(version)
  const data = require('./minecraft_extracted_data/minecraft_generated_blocks.json')

  if (!data) {
    console.log('No api for ' + version)
    return
  }
  for (const block of blocks) {
    const apiblock = data['minecraft:' + block.name]
    if (!apiblock) {
      console.log('Missing block in api: ' + block.name)
      continue
    }

    // Update states
    block.states = []
    if (apiblock.properties) {
      for (const [prop, values] of Object.entries(apiblock.properties)) {
        let type = 'enum'
        if (values[0] === 'true') type = 'bool'
        if (values[0] === '0') type = 'int'
        const state = {
          name: prop,
          type,
          num_values: values.length
        }
        if (type === 'enum') {
          state.values = values
        }
        block.states.push(state)
      }
    }

    // Set defaultState
    block.defaultState = block.minState
    for (const state of apiblock.states) {
      if (state.default) {
        block.defaultState = state.id
        break
      }
    }
  }

  fs.writeFileSync(blockFile, JSON.stringify(blocks, null, 2))
  await fs.promises.rm(path.join('minecraft_extracted_data', 'extract_data_from_minecraft.json'))
}

if (!process.argv[2] || !process.argv[3]) {
  console.log('Usage: patch_states.js <version> <inFile>')
  process.exit(1)
}

handle(process.argv[2], process.argv[3])
