'use strict'

const fs = require('fs')
const path = require('path')
const getPotentialDrops = require('prismarine-loottable').getPotentialDrops

function removeNamespace(name) {
  if (name.startsWith('minecraft:'))
    name = name.substring(10)

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

function requiresSilkTouch (drop) {
  for (const condition of drop.conditions) {
    if (condition.isSilkTouch()) return true
  }

  return false
}

function requiresPlayerKill (drop) {
  for (const condition of drop.conditions) {
    if (condition.type === 'minecraft:killed_by_player') return true
  }

  return false
}

function extractTable (obj, lootTable) {
  const drops = getPotentialDrops(lootTable)

  obj.drops = []
  for (const drop of drops) {
    const dropInfo = {}
    obj.drops.push(dropInfo)

    dropInfo.item = removeNamespace(drop.itemType)
    dropInfo.dropChance = drop.dropChance

    if (obj.block !== undefined) {
      dropInfo.silkTouch = requiresSilkTouch(drop)
    } else {
      dropInfo.playerKill = requiresPlayerKill(drop)
    }
  }
}

function handle (dataFolder, mcDataFolder, version) {
  dataFolder += '/' + version

  const raw = path.resolve(dataFolder + '/data/loot_tables')

  const lootDataPath = path.resolve(mcDataFolder + '/data/pc/' + version + '/loot.json')

  const lootData = []

  const blockLootFiles = fs.readdirSync(path.join(raw, 'blocks'))
  const entityLootFiles = fs.readdirSync(path.join(raw, 'entities'))

  for (const blockLoot of blockLootFiles) {
    const fullPath = path.join(raw, 'blocks', blockLoot)
    if (fs.statSync(fullPath).isDirectory()) continue

    const name = blockLoot.substring(0, blockLoot.length - 5)
    extractBlockTable(lootData, require(fullPath), name)
  }

  for (const entityLoot of entityLootFiles) {
    const fullPath = path.join(raw, 'entities', entityLoot)
    if (fs.statSync(fullPath).isDirectory()) continue

    const name = entityLoot.substring(0, entityLoot.length - 5)
    extractEntityTable(lootData, require(fullPath), name)
  }

  fs.writeFileSync(lootDataPath, JSON.stringify(lootData, null, 2))
  console.log(`Version ${version} finished. (${blockLootFiles.length + entityLootFiles.length} files processed)`)
}

if (process.argv.length !== 5) {
  console.log('Usage: node extract_lootTables.js <version1,version2,...> <extractedDataFolder> <mcDataFolder>')
  process.exit(1)
}

const versions = process.argv[2].split(',')
const dataFolder = path.resolve(process.argv[3])
const mcDataFolder = path.resolve(process.argv[4])

for (const version of versions) handle(dataFolder, mcDataFolder, version)
