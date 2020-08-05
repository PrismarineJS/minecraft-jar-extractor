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
        if (block !== undefined) dropIds.push(block)
        continue
      }

      recursiveDropSearch(object[prop])
    }
  }

  recursiveDropSearch(lootTable)

  return dropIds
}

function handle (dataFolder, mcDataFolder, version) {
  dataFolder += '/' + version

  const raw = path.resolve(dataFolder + '/data/loot_tables/blocks')

  const blockDataPath = path.resolve(
    mcDataFolder + '/data/pc/' + version + '/blocks.json'
  )

  const itemDataPath = path.resolve(
    mcDataFolder + '/data/pc/' + version + '/items.json'
  )

  const blockData = require(blockDataPath)
  const itemData = require(itemDataPath)

  let fileCount = 0
  for (const prop in blockData) {
    const block = blockData[prop]

    const inputPath = path.join(raw, block.name + '.json')
    if (!fs.existsSync(inputPath)) {
      block.drops = []
      continue
    }

    fileCount++

    const lootTable = require(inputPath)
    block.drops = extractDropIds(itemData, lootTable)
  }

  fs.writeFileSync(blockDataPath, JSON.stringify(blockData, null, 2))
  console.log(`Version ${version} finished. (${fileCount} files processed)`)
}

if (process.argv.length !== 5) {
  console.log(
    'Usage: node extract_block_lootTables.js <version1,version2,...> <extractedDataFolder> <mcDataFolder>'
  )
  process.exit(1)
}

const versions = process.argv[2].split(',')
const dataFolder = path.resolve(process.argv[3])
const mcDataFolder = path.resolve(process.argv[4])

for (const version of versions) handle(dataFolder, mcDataFolder, version)
