'use strict';

const fs = require("fs");
const path = require("path");
const mcData = require("minecraft-data")("1.8");
const getMinecraftFiles = require("./get_minecraft_files");

if(process.argv.length != 6) {
  console.log("Usage : node image_names.js <minecraftVersion> <blocks_textures> <items_textures> <temporary_dir>");
  process.exit(1);
}

const minecraftVersion=process.argv[2];
const blocksTexturesPath=process.argv[3];
const itemsTexturesPath=process.argv[4];
const temporaryDir=process.argv[5];

extract(minecraftVersion,blocksTexturesPath,itemsTexturesPath,temporaryDir,function(err){
  if(err) {
    console.log(err.stack);
    return;
  }
  console.log("done !");
});

const itemMapping={
  "wooden_door":"oak_door",
  "fish":"pufferfish",
  "cooked_fish":"cooked_salmon",
  "dye":"dye_black",
  "potion":"bottle_drinkable",
  "skull":"skull_char"
};

function extractBlockState(name,path) {
  if(name===null)
    return null;
  else {
    try {
      const t = JSON.parse(fs.readFileSync(path + name + ".json", "utf8"));
      const firstVariant=t["variants"][Object.keys(t["variants"])[0]];
      return firstVariant.model || firstVariant[0].model;
    }
    catch(err) {
      return null;
    }
  }
}

function extractModel(name,path) {
  if(name===null)
    return null;
  else {
    try {
      const t = JSON.parse(fs.readFileSync(path + name + ".json", "utf8"));
      return !t.textures ? null : t.textures[Object.keys(t.textures)[0]];
    }
    catch(err) {
      console.log(name);
    }
  }
}

function getItems(unzippedFilesDir,itemsTexturesPath) {
  const itemTextures = mcData.itemsArray.map(item => {
    const model = itemMapping[item.name] ? itemMapping[item.name] : item.name;
    const texture = extractModel(model, unzippedFilesDir + "/assets/minecraft/models/item/");
    return {
      name: item.name,
      model: model,
      texture: texture
    }
  });
  fs.writeFileSync(itemsTexturesPath, JSON.stringify(itemTextures, null, 2));
}

function getBlocks(unzippedFilesDir,blocksTexturesPath) {
  const blockModel = mcData.blocksArray.map(block => {
    const model = extractBlockState(block.name, unzippedFilesDir + "/assets/minecraft/blockstates/");
    const texture = extractModel(model, unzippedFilesDir + "/assets/minecraft/models/block/");
    return {
      name: block.name,
      model: model,
      texture: texture
    }
  });
  fs.writeFileSync(blocksTexturesPath, JSON.stringify(blockModel, null, 2));
}


function extract(minecraftVersion,itemsTexturesPath,blocksTexturesPath,temporaryDir,cb) {
  getMinecraftFiles(minecraftVersion,temporaryDir, function (err, unzippedFilesDir) {
    if (err) {
      cb(err);
      return;
    }
    getItems(unzippedFilesDir,itemsTexturesPath);
    getBlocks(unzippedFilesDir,blocksTexturesPath);
    cb();
  });
}