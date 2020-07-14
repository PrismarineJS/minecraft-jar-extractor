const LauncherDownload = require('minecraft-wrap').LauncherDownload
const path = require('path')
const fs = require('fs')
if (!(process.argv.length >= 3 && process.argv.length <= 4)) {
  console.log('Usage : node lang.js <version>')
  process.exit(0)
}

const version = process.argv[2]
const dir = path.join(process.env.APPDATA, '/.minecraft')
const os = process.platform

const ld = new LauncherDownload(dir, os)

if (!fs.existsSync(path.join(__dirname, version))) {
  fs.mkdirSync(path.join(__dirname, version), (err) => { console.error(err) })
}

ld.getAssetIndex(version).then(assets => {
  Object.keys(assets.objects).forEach(asset => {
    if (/^(minecraft\/lang\/)/.test(asset)) {
      ld.getAsset(asset, version).then(r => {
        fs.readFile(r, { encoding: 'utf8' }, (err, data) => {
          if (err) console.error(err)
          fs.writeFileSync(path.join(__dirname, version + '/' + asset.split('/')[2]), data)
        })
      })
    }
  })
}).catch(err => {
  console.log(err)
})
