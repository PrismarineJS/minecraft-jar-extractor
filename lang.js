'use strict'

const fs = require('fs-extra')
const path = require('path')
const getMinecraftFiles = require('./get_minecraft_files')

if (process.argv.length !== 5) {
  console.log('Usage : node lang.js <version1,version2,...> <output_dir> <temporary_dir>')
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

function copyLang (unzippedFilesDir, outputDir) {
  try {
    fs.copySync(unzippedFilesDir + '/assets/minecraft/lang/en_US.lang', outputDir + '/en_us.lang')
  } catch (err) {
    try {
      fs.copySync(unzippedFilesDir + '/assets/minecraft/lang/en_us.lang', outputDir + '/en_us.lang')
    } catch (err) {
      fs.copySync(unzippedFilesDir + '/assets/minecraft/lang/en_us.json', outputDir + '/en_us.json')
    }
  }
}

function parseLang (outputDir) {
  if (fs.existsSync(outputDir + '/en_us.json')) {
    return
  }
  const lang = {}
  fs.readFileSync(outputDir + '/en_us.lang', 'utf8').split('\n').forEach(function (l) {
    const c = l.split(/=(.+)/)
    if (c.length === 3) lang[c[0]] = c[1]
  })

  fs.writeFileSync(outputDir + '/en_us.json', JSON.stringify(lang, null, 2))
}

function extract (minecraftVersion, outputDir, temporaryDir, cb) {
  getMinecraftFiles(minecraftVersion, temporaryDir, function (err, unzippedFilesDir) {
    if (err) {
      cb(err)
      return
    }
    fs.mkdirpSync(outputDir)
    copyLang(unzippedFilesDir, outputDir)
    parseLang(outputDir)
    cb()
  })
}
