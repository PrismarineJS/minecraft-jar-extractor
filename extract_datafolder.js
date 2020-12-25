'use strict'

const fs = require('fs-extra')
const path = require('path')
const getMinecraftFiles = require('./get_minecraft_files')

if (process.argv.length !== 5) {
  console.log(
    'Usage : node extract_datafolder.js <version1,version2,...> <output_dir> <temporary_dir>'
  )
  process.exit(1)
}

const minecraftVersions = process.argv[2].split(',')
const outputDir = path.resolve(process.argv[3])
const temporaryDir = path.resolve(process.argv[4])

minecraftVersions.forEach(minecraftVersion => {
  extract(
    minecraftVersion,
    outputDir + '/' + minecraftVersion,
    temporaryDir,
    function (err) {
      if (err) {
        console.log(err.stack)
        return
      }
      console.log('done ' + minecraftVersion + '!')
    }
  )
})

function copyFileSync (source, target) {
  let targetFile = target

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

function copyFolderRecursiveSync (source, target) {
  let files = []

  const targetFolder = path.join(target, path.basename(source))
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
  }

  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(function (file) {
      const curSource = path.join(source, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder)
      } else {
        copyFileSync(curSource, targetFolder)
      }
    })
  }
}

function extract (minecraftVersion, outputDir, temporaryDir, cb) {
  getMinecraftFiles(minecraftVersion, temporaryDir, function (
    err,
    unzippedFilesDir
  ) {
    if (err) {
      cb(err)
      return
    }
    fs.mkdirpSync(outputDir)
    copyFolderRecursiveSync(
      path.join(unzippedFilesDir, 'data', 'minecraft'),
      outputDir
    )
    fs.rename(path.join(outputDir, 'minecraft'), path.join(outputDir, 'data'))

    cb()
  })
}
