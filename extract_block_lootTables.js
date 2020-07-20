'use strict'

const fs = require('fs')
const path = require('path')

function getBlockId (data, name) {
  for (const prop in data) {
    const block = data[prop]
    if (`minecraft:${block.name}` === name) return block.id
  }
}

function extractDropIds (data, lootTable) {
  const blockIds = []

  // TODO Parse lootTable to provide accurate drop data.
  // if (!lootTable.pools || lootTable.pools.length === 0) return blockIds

  function recursiveDropSearch (object) {
    for (const prop in object) {
      const info = object[prop]
      if (typeof info === 'string') {
        const block = getBlockId(data, info)
        if (block !== undefined) blockIds.push(block)
        continue
      }

      recursiveDropSearch(object[prop])
    }
  }

  recursiveDropSearch(lootTable)

  return blockIds
}

function handle (dataFolder, mcDataFolder, version) {
  dataFolder += '/' + version

  const raw = path.resolve(dataFolder + '/data/loot_tables/blocks')
  const target = path.resolve(
    mcDataFolder + '/data/pc/' + version + '/blocks.json'
  )

  const data = require(target)

  let fileCount = 0
  for (const prop in data) {
    const block = data[prop]

    const inputPath = path.join(raw, block.name + '.json')
    if (!fs.existsSync(inputPath)) {
      block.drops = []
      continue
    }

    fileCount++

    const lootTable = require(inputPath)
    block.drops = extractDropIds(data, lootTable)
  }

  fs.writeFileSync(target, JSON.stringify(data, null, 2))
  console.log(`Version ${version} finished. (${fileCount} files processed)`)
}

if (process.argv.length !== 4) {
  console.log(
    'Usage: node extract_block_lootTables.js <version1,version2,...> <extractedDataFolder> <mcDataFolder>'
  )
  process.exit(1)
}

const versions = process.argv[2].split(',')
const dataFolder = path.resolve(process.argv[3])
const mcDataFolder = path.resolve(process.argv[4])

for (const version of versions) handle(dataFolder, mcDataFolder, version)
