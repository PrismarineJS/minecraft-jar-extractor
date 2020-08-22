'use strict'

const fs = require('fs')
const path = require('path')
const getPotentialDrops = require('prismarine-loottable').getPotentialDrops

function removeNamespace (name) {
  if (name.startsWith('minecraft:')) name = name.substring(10)
  return name
}

function extractBlockTable (lootData, lootTable, name) {
  const obj = {}
  obj.block = removeNamespace(name)
  extractTable(obj, lootTable)
  lootData.push(obj)
}

function extractEntityTable (lootData, lootTable, name) {
  const obj = {}
  obj.entity = removeNamespace(name)
  extractTable(obj, lootTable)
  lootData.push(obj)
}

function shrinkRange(range) {
  if (range[0] === range[1]) return range[0]
  else return range
}

function extractTable (obj, lootTable) {
  const drops = getPotentialDrops(lootTable)

  obj.drops = []
  for (const drop of drops) {
    const dropInfo = {}
    obj.drops.push(dropInfo)

    dropInfo.item = removeNamespace(drop.itemType)
    dropInfo.dropChance = drop.estimateDropChance()
    dropInfo.stackSize = shrinkRange(drop.getStackSizeRange())

    if (obj.block !== undefined) {
      dropInfo.silkTouch = drop.requiresSilkTouch() || undefined
      dropInfo.noSilkTouch = drop.requiresNoSilkTouch() || undefined
      dropInfo.blockAge = drop.getRequiredBlockAge() || undefined
    } else {
      dropInfo.playerKill = drop.requiresPlayerKill() || undefined
    }
  }
}

function generate (inputDir, outputFile, handlerFunction) {
  const lootData = []

  const lootFiles = fs.readdirSync(inputDir)
  for (const loot of lootFiles) {
    const fullPath = path.join(inputDir, loot)
    if (fs.statSync(fullPath).isDirectory()) continue

    const name = loot.substring(0, loot.length - 5)
    handlerFunction(lootData, require(fullPath), name)
  }

  fs.writeFileSync(outputFile, JSON.stringify(lootData, null, 2))
  return lootFiles.length
}

function handle (dataFolder, mcDataFolder, version) {
  dataFolder += '/' + version

  const raw = path.resolve(dataFolder + '/data/loot_tables')
  const dataPath = path.resolve(mcDataFolder + '/data/pc/' + version)

  let entryCount = 0
  entryCount += generate(path.join(raw, 'blocks'), path.join(dataPath, 'blockLoot.json'), extractBlockTable)
  entryCount += generate(path.join(raw, 'entities'), path.join(dataPath, 'entityLoot.json'), extractEntityTable)

  console.log(`Version ${version} finished. (${entryCount} entries processed)`)
}

if (process.argv.length !== 5) {
  console.log('Usage: node extract_lootTables.js <version1,version2,...> <extractedDataFolder> <mcDataFolder>')
  process.exit(1)
}

const versions = process.argv[2].split(',')
const dataFolder = path.resolve(process.argv[3])
const mcDataFolder = path.resolve(process.argv[4])

for (const version of versions) handle(dataFolder, mcDataFolder, version)
