'use strict'

const fs = require('fs-extra')
const path = require('path')
const getMinecraftFiles = require('./get_minecraft_files')

if (process.argv.length !== 5) {
  console.log('Usage : node image_names.js <version1,version2,...> <output_dir> <temporary_dir>')
  process.exit(1)
}

const minecraftVersions = process.argv[2].split(',')
const outputDir = path.resolve(process.argv[3])
const temporaryDir = path.resolve(process.argv[4])

minecraftVersions.forEach(minecraftVersion => {
  extract(minecraftVersion, outputDir + '/' + minecraftVersion, temporaryDir, function (err) {
    if (err) {
      console.log(err.stack)
      return
    }
    console.log('done ' + minecraftVersion + '!')
  })
})

// doesn't support 1.7.10 : completely different organization (no block state, no model)
const itemMapping = {
  '1.8.8': {
    wooden_door: 'oak_door',
    fish: 'pufferfish',
    cooked_fish: 'cooked_salmon',
    dye: 'dye_black',
    potion: 'bottle_drinkable',
    skull: 'skull_char'
  },
  1.9: {
    wooden_door: 'oak_door',
    fish: 'pufferfish',
    cooked_fish: 'cooked_salmon',
    dye: 'dye_black',
    potion: 'bottle_drinkable',
    skull: 'skull_char',
    boat: 'oak_boat',
    splash_potion: 'bottle_splash',
    lingering_potion: 'bottle_lingering'
  },
  '1.10': {
    wooden_door: 'oak_door',
    fish: 'pufferfish',
    cooked_fish: 'cooked_salmon',
    dye: 'dye_black',
    potion: 'bottle_drinkable',
    skull: 'skull_char',
    boat: 'oak_boat',
    splash_potion: 'bottle_splash',
    lingering_potion: 'bottle_lingering'
  },
  '1.11.2': {
    wooden_door: 'oak_door',
    fish: 'pufferfish',
    cooked_fish: 'cooked_salmon',
    dye: 'dye_black',
    potion: 'bottle_drinkable',
    skull: 'skull_char',
    boat: 'oak_boat',
    totem_of_undying: 'totem',
    splash_potion: 'bottle_splash',
    lingering_potion: 'bottle_lingering'
  },
  1.12: {
    wooden_door: 'oak_door',
    fish: 'pufferfish',
    cooked_fish: 'cooked_salmon',
    dye: 'dye_black',
    potion: 'bottle_drinkable',
    skull: 'skull_char',
    boat: 'oak_boat',
    totem_of_undying: 'totem',
    splash_potion: 'bottle_splash',
    lingering_potion: 'bottle_lingering'
  },
  1.13: {
  }
}

// TODO: read the decompiled code (automatically) to generate this
const blockMapping = {
  '1.8.8': {
    log: 'oak_log',
    planks: 'oak_planks',
    sapling: 'oak_sapling',
    leaves: 'oak_leaves',
    tallgrass: 'tall_grass',
    deadbush: 'dead_bush',
    wool: 'white_wool',
    piston_extension: 'piston',
    yellow_flower: 'dandelion',
    red_flower: 'poppy',
    double_stone_slab: 'stone_double_slab',
    stained_glass: 'white_stained_glass',
    double_wooden_slab: 'oak_double_slab',
    wooden_slab: 'oak_slab',
    stained_hardened_clay: 'white_stained_hardened_clay',
    stained_glass_pane: 'white_stained_glass_pane',
    log2: 'acacia_log',
    leaves2: 'acacia_leaves',
    carpet: 'white_carpet',
    double_plant: 'sunflower',
    double_stone_slab2: 'red_sandstone_double_slab',
    stone_slab2: 'red_sandstone_slab'
  },
  1.9: {
    log: 'oak_log',
    planks: 'oak_planks',
    sapling: 'oak_sapling',
    leaves: 'oak_leaves',
    tallgrass: 'tall_grass',
    deadbush: 'dead_bush',
    wool: 'white_wool',
    piston_extension: 'piston',
    yellow_flower: 'dandelion',
    red_flower: 'poppy',
    double_stone_slab: 'stone_double_slab',
    stained_glass: 'white_stained_glass',
    double_wooden_slab: 'oak_double_slab',
    wooden_slab: 'oak_slab',
    stained_hardened_clay: 'white_stained_hardened_clay',
    stained_glass_pane: 'white_stained_glass_pane',
    log2: 'acacia_log',
    leaves2: 'acacia_leaves',
    carpet: 'white_carpet',
    double_plant: 'sunflower',
    double_stone_slab2: 'red_sandstone_double_slab',
    stone_slab2: 'red_sandstone_slab'
  },
  '1.10': {
    log: 'oak_log',
    planks: 'oak_planks',
    sapling: 'oak_sapling',
    leaves: 'oak_leaves',
    tallgrass: 'tall_grass',
    deadbush: 'dead_bush',
    wool: 'white_wool',
    piston_extension: 'piston',
    yellow_flower: 'dandelion',
    red_flower: 'poppy',
    double_stone_slab: 'stone_double_slab',
    stained_glass: 'white_stained_glass',
    double_wooden_slab: 'oak_double_slab',
    wooden_slab: 'oak_slab',
    stained_hardened_clay: 'white_stained_hardened_clay',
    stained_glass_pane: 'white_stained_glass_pane',
    log2: 'acacia_log',
    leaves2: 'acacia_leaves',
    carpet: 'white_carpet',
    double_plant: 'sunflower',
    double_stone_slab2: 'red_sandstone_double_slab',
    stone_slab2: 'red_sandstone_slab'
  },
  '1.11.2': {
    log: 'oak_log',
    planks: 'oak_planks',
    sapling: 'oak_sapling',
    leaves: 'oak_leaves',
    tallgrass: 'tall_grass',
    deadbush: 'dead_bush',
    wool: 'white_wool',
    piston_extension: 'piston',
    yellow_flower: 'dandelion',
    red_flower: 'poppy',
    double_stone_slab: 'stone_double_slab',
    stained_glass: 'white_stained_glass',
    double_wooden_slab: 'oak_double_slab',
    wooden_slab: 'oak_slab',
    stained_hardened_clay: 'white_stained_hardened_clay',
    stained_glass_pane: 'white_stained_glass_pane',
    log2: 'acacia_log',
    leaves2: 'acacia_leaves',
    carpet: 'white_carpet',
    double_plant: 'sunflower',
    double_stone_slab2: 'red_sandstone_double_slab',
    stone_slab2: 'red_sandstone_slab'
  },
  1.12: {
    log: 'oak_log',
    planks: 'oak_planks',
    sapling: 'oak_sapling',
    leaves: 'oak_leaves',
    tallgrass: 'tall_grass',
    deadbush: 'dead_bush',
    wool: 'white_wool',
    piston_extension: 'piston',
    yellow_flower: 'dandelion',
    red_flower: 'poppy',
    double_stone_slab: 'stone_double_slab',
    stained_glass: 'white_stained_glass',
    double_wooden_slab: 'oak_double_slab',
    wooden_slab: 'oak_slab',
    stained_hardened_clay: 'white_stained_hardened_clay',
    stained_glass_pane: 'white_stained_glass_pane',
    log2: 'acacia_log',
    leaves2: 'acacia_leaves',
    carpet: 'white_carpet',
    double_plant: 'sunflower',
    double_stone_slab2: 'red_sandstone_double_slab',
    stone_slab2: 'red_sandstone_slab'
  },
  1.13: {
  }
}

function extractBlockState (name, path, full = false) {
  if (name === null) { return null } else {
    try {
      name = name.replace(/minecraft:/, '')
      const t = JSON.parse(fs.readFileSync(path + name + '.json', 'utf8'))
      if (full) return t
      const firstVariant = t.variants[Object.keys(t.variants)[0]]
      return firstVariant.model || firstVariant[0].model
    } catch (err) {
      return null
    }
  }
}

function extractModel (name, path, full = false) {
  if (name === null) {
    return null
  } else {
    try {
      name = name.replace(/^(?:block\/)?minecraft:/, '')
      const t = JSON.parse(fs.readFileSync(path + name + '.json', 'utf8'))
      if (full) return t
      if (t.textures) {
        return t.textures[Object.keys(t.textures)[0]]
      }
      if (t.parent) {
        if (t.parent.startsWith('builtin/')) {
          return null
        }
        return extractModel(t.parent, path)
      }
      return null
    } catch (err) {
      console.log(err.stack)
      console.log(name)
    }
  }
}

function getItems (unzippedFilesDir, itemsTexturesPath, itemMapping, version) {
  const mcData = require('minecraft-data')(version)
  const itemTextures = mcData.itemsArray.map(item => {
    const model = (itemMapping !== undefined && itemMapping[item.name] ? itemMapping[item.name] : item.name).replace(/minecraft:/, '')
    const texture = extractModel('item/' + model, unzippedFilesDir + '/assets/minecraft/models/')
    return {
      name: item.name,
      model: !model ? null : model.replace('item/', 'items/'),
      texture: !texture ? null : texture.replace('item/', 'items/')
    }
  })
  fs.writeFileSync(itemsTexturesPath, JSON.stringify(itemTextures, null, 2))
}

function getBlocks (unzippedFilesDir, blocksTexturesPath, blockMapping, version) {
  const mcData = require('minecraft-data')(version)
  const blockModel = mcData.blocksArray.map(block => {
    const blockState = (blockMapping !== undefined && blockMapping[block.name] ? blockMapping[block.name] : block.name).replace(/minecraft:/, '')
    const model = extractBlockState(blockState, unzippedFilesDir + '/assets/minecraft/blockstates/')
    const texture = extractModel(!model ? null : (model.startsWith('block/') ? model : 'block/' + model), unzippedFilesDir + '/assets/minecraft/models/')
    return {
      name: block.name,
      blockState: blockState,
      model: !model ? null : model.replace('block/', 'blocks/'),
      texture: !texture ? null : texture.replace('block/', 'blocks/')
    }
  })
  fs.writeFileSync(blocksTexturesPath, JSON.stringify(blockModel, null, 2))
}

function getModels (unzippedFilesDir, blocksStatesPath, blocksModelsPath, blockMapping, version) {
  const mcData = require('minecraft-data')(version)
  const blocksStates = {}
  for (const block of mcData.blocksArray) {
    const blockState = blockMapping !== undefined && blockMapping[block.name] ? blockMapping[block.name] : block.name
    const state = extractBlockState(blockState, unzippedFilesDir + '/assets/minecraft/blockstates/', true)
    blocksStates[block.name] = state
  }
  const modelsPath = unzippedFilesDir + '/assets/minecraft/models/block/'
  const modelFiles = fs.readdirSync(modelsPath)
  const models = {}
  for (const name of modelFiles) {
    const model = require(modelsPath + name)
    models[name.split('.')[0]] = model
  }
  fs.writeFileSync(blocksStatesPath, JSON.stringify(blocksStates, null, 2))
  fs.writeFileSync(blocksModelsPath, JSON.stringify(models, null, 2))
}

function copyTextures (unzippedFilesDir, outputDir, minecraftVersion) {
  const recentVersion = minecraftVersion.startsWith('1.13') || minecraftVersion.startsWith('1.14') || minecraftVersion.startsWith('1.15') || minecraftVersion.startsWith('1.16')
  const inputBlocksDir = recentVersion ? 'block' : 'blocks'
  const inputItemsDir = recentVersion ? 'item' : 'items'

  fs.copySync(unzippedFilesDir + '/assets/minecraft/textures/' + inputBlocksDir, outputDir + '/blocks')
  fs.copySync(unzippedFilesDir + '/assets/minecraft/textures/' + inputItemsDir, outputDir + '/items')
}

function generateTextureContent (outputDir) {
  const blocksItems = require(outputDir + '/items_textures.json').concat(require(outputDir + '/blocks_textures.json'))
  const arr = blocksItems.map(b => ({
    name: b.name,
    texture: b.texture == null
      ? null
      : ('data:image/png;base64,' + fs.readFileSync(outputDir + '/' + b.texture.replace('item/', 'items/').replace('block/', 'blocks/').replace(/minecraft:/, '') + '.png', 'base64'))
  }))
  fs.writeFileSync(outputDir + '/texture_content.json', JSON.stringify(arr, null, 2))
}

function extract (minecraftVersion, outputDir, temporaryDir, cb) {
  getMinecraftFiles(minecraftVersion, temporaryDir, function (err, unzippedFilesDir) {
    if (err) {
      cb(err)
      return
    }
    fs.mkdirpSync(outputDir)
    getItems(unzippedFilesDir, outputDir + '/items_textures.json', itemMapping[minecraftVersion], minecraftVersion)
    getBlocks(unzippedFilesDir, outputDir + '/blocks_textures.json', blockMapping[minecraftVersion], minecraftVersion)
    getModels(unzippedFilesDir, outputDir + '/blocks_states.json', outputDir + '/blocks_models.json', blockMapping[minecraftVersion], minecraftVersion)
    copyTextures(unzippedFilesDir, outputDir, minecraftVersion)
    generateTextureContent(outputDir)
    cb()
  })
}
