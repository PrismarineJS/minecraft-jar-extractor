const downloadClient = require('minecraft-wrap').downloadClient
const extract = require('extract-zip')
const fs = require('fs-extra')

function getMinecraftFiles (minecraftVersion, temporaryDir, cb) {
  const jarPath = temporaryDir + '/' + minecraftVersion + '.jar'
  const unzippedFilesDir = temporaryDir + '/' + minecraftVersion
  fs.mkdirpSync(unzippedFilesDir)
  downloadClient(minecraftVersion, jarPath, function (err) {
    if (err) {
      cb(err)
      return
    }
    extract(jarPath, { dir: unzippedFilesDir }, function (err) {
      if (err) {
        cb(err)
        return
      }
      cb(null, unzippedFilesDir)
    })
  })
}

module.exports = getMinecraftFiles
