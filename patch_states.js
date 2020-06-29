const fs = require('fs')
const path = require('path')
const request = require('request')

if (process.argv.length !== 3) {
  console.log('Usage : node patch_states.js <minecraft-data directory>')
  process.exit(1)
}

const mcDataPath = path.resolve(process.argv[2])

function getJSON (url, cb) {
  request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (err || res.statusCode !== 200) {
      cb(null)
    } else {
      cb(data)
    }
  })
}

function forEachVersion (f) {
  const versions = require(mcDataPath + '/data/pc/common/versions')
  versions.forEach((version) => {
    f(path.join(mcDataPath + '/data', 'pc', version), version)
  })
}

forEachVersion((p, version) => {
  const blockFile = path.join(p, 'blocks.json')
  if (!fs.existsSync(blockFile)) {
    console.log('No blocks for version ' + version)
    return
  }
  const blocks = require(blockFile)

  getJSON(`https://apimon.de/mcdata/${version}/blocks.json`, (data) => {
    if (!data) {
      console.log('No api for ' + version)
      return
    }
    for (const block of blocks) {
      const apiblock = data['minecraft:' + block.name]
      if (!apiblock) {
        console.log('Missing block in api: ' + block.name)
        continue
      }

      // Update states
      block.states = []
      if (apiblock.properties) {
        for (const [prop, values] of Object.entries(apiblock.properties)) {
          let type = 'enum'
          if (values[0] === 'true') type = 'bool'
          if (values[0] === '0') type = 'int'
          const state = {
            name: prop,
            type,
            num_values: values.length
          }
          if (type === 'enum') {
            state.values = values
          }
          block.states.push(state)
        }
      }

      // Set defaultState
      block.defaultState = block.minState
      for (const state of apiblock.states) {
        if (state.default) {
          block.defaultState = state.id
          break
        }
      }
    }

    fs.writeFileSync(blockFile, JSON.stringify(blocks, null, 2))
  })
})
