'use strict'

const fs = require('fs')
const path = require('path')

function getItemId (data, name) {
  for (const prop in data) {
    const item = data[prop]
    if (`minecraft:${item.name}` === name) return item.id
  }
}

function extractDropIds (itemData, lootTable) {
  const dropIds = []

  function recursiveDropSearch (object) {
    for (const prop in object) {
      const info = object[prop]
      if (typeof info === 'string') {
        const block = getItemId(itemData, info)
        if (block !== undefined && dropIds.indexOf(block) === -1) {
          dropIds.push(block)
        }

        continue
      }

      recursiveDropSearch(object[prop])
    }
  }

  recursiveDropSearch(lootTable)

  return dropIds
}
/**
 * adds drops to a blocks.json
 * @param {string} outPath path to folder with blocks.json & items.json
 * @param {string} inPath extracted data
 */
function handle (outPath, inPath) {
  const outPathResolved = path.resolve(outPath)
  const dataFolder = path.join(inPath, 'data', 'loot_tables', 'blocks')

  const blocksFilePath = path.join(outPathResolved, 'blocks.json')
  const itemDataPath = path.join(outPathResolved, 'items.json')

  const blockData = require(blocksFilePath)
  const itemData = require(itemDataPath)

  for (const prop in blockData) {
    const block = blockData[prop]

    const inputPath = path.join(dataFolder, block.name + '.json')
    if (!fs.existsSync(inputPath)) {
      block.drops = []
      continue
    }

    const lootTable = require(inputPath)
    block.drops = extractDropIds(itemData, lootTable)
  }

  fs.writeFileSync(blocksFilePath, JSON.stringify(blockData, null, 2))
}

if (!process.argv[2] || !process.argv[3]) {
  console.log('Usage: extract_block_lootTables.js <jsonPath> <dataPath>')
  process.exit(1)
}

handle(process.argv[2], process.argv[3])
