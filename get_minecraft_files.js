const downloadClient = require('minecraft-wrap').downloadClient
const extract = require('extract-zip')
const fs = require('fs-extra')
const nodefs = require('fs');

function hasDir(path) {
  return nodefs.existsSync(path) && nodefs.readdirSync(path).length != 0;
}

function getMinecraftFiles (minecraftVersion, tempOrInputDir, cb) {
  const jarPath = tempOrInputDir + '/' + minecraftVersion + '.jar'
  const unzippedFilesDir = tempOrInputDir + '/' + minecraftVersion

  if (hasDir(tempOrInputDir)) {
    if (hasDir(tempOrInputDir + "/assets")) {
      console.log('using provided minecraft dir');
      cb(null, tempOrInputDir);
      return;
    } else if (hasDir(unzippedFilesDir)) {
      console.log('using cached minecraft dir');
      cb(null, unzippedFilesDir);
      return;
    }
  }

  fs.mkdirpSync(unzippedFilesDir)
  downloadClient(minecraftVersion, jarPath, async (err) => {
    if (err) {
      cb(err)
      return
    }
    try {
      await extract(jarPath, { dir: unzippedFilesDir })
      cb(null, unzippedFilesDir)
    } catch (err) {
      cb(err)
    }
  })
}

module.exports = getMinecraftFiles
