const LauncherDownload = require('minecraft-wrap').LauncherDownload
const path = require('path')
const fs = require('fs')
if (!(process.argv.length >= 5 && process.argv.length <= 6)) {
  console.log('Usage : node lang.js <version1,version2,...> <lang1,lang2,...>|* <output_dir>')
  process.exit(0)
}

const versions = process.argv[2].split(',')
const dir = path.join(process.env.APPDATA, '/.minecraft')
const os = process.platform
const langs = process.argv[3] !== '*' ? process.argv[3].split(',') : '*'
const dirToSave = process.argv[4]

const ld = new LauncherDownload(dir, os)

if (!fs.existsSync(path.join(__dirname, dirToSave))) {
  fs.mkdirSync(path.join(__dirname, dirToSave), (err) => { console.error(err) })
}
let langi = 0
versions.forEach(version => {
  const assetsCurrent = []
  ld.getAssetIndex(version).then(assets => {
    Object.keys(assets.objects).forEach(asset => {
      if (/^(minecraft\/lang\/)/.test(asset)) {
        if (langs !== '*') {
          if (langs[langi] === asset.split('/')[2].split('.')[0]) {
            assetsCurrent.push(asset); langi++
          }
        } else assetsCurrent.push(asset)
      }
    })

    downloadLangs(version, assetsCurrent)
  }).catch(err => {
    console.log(err)
  })
})

const downloadLangs = (version, assets) => {
  assets.forEach(asset => {
    ld.getAsset(asset, version).then(r => {
      fs.readFile(r, { encoding: 'utf8' }, (err, data) => {
        if (err) console.error(err)
        fs.writeFileSync(path.join(__dirname, dirToSave + '/' + asset.split('/')[2]), data)
      })
    })
  })
}
