# minecraft-jar-extractor

[![NPM version](https://img.shields.io/npm/v/minecraft-jar-extractor.svg)](http://npmjs.com/package/minecraft-jar-extractor)
[![Build Status](https://github.com/PrismarineJS/minecraft-jar-extractor/workflows/CI/badge.svg)](https://github.com/PrismarineJS/minecraft-jar-extractor/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-brightgreen.svg)](https://gitter.im/PrismarineJS/general)
[![Irc](https://img.shields.io/badge/chat-on%20irc-brightgreen.svg)](https://irc.gitter.im/)

[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/minecraft-jar-extractor)

Extract structured data from the minecraft jar

## image name extractor

Just run `node image_names.js <version1,version2,...> <output_dir> <temporary_dir>`
and get a directory containing the name->texture mapping and the textures.

Result of that currently online at [minecraft-assets](https://github.com/rom1504/minecraft-assets)

## lang extractor

Just run `node lang.js <version1,version2,...> <output_dir> <temporary_dir>`
and get a directory containing en_us.lang and en_us.json

## protocol extractor

How to use it:

1. `node downloadDecompile.js 1.8.8 /tmp/the_output`
2. `node protocol_extractor.js /tmp/the_output/decompiled`
3. get a protocol.json describing the classname<->id relation and some fields information

## block loot table extractor

Only works in 1.14+ as the loot table files did not exist before this.

Make sure to first extract the data folder from Minecraft jar if not done already using:
`node extract_datafolder.js <version1,version2,...> <output_dir> <temporary_dir>`

Next you can extract the actual loot table data to Minecraft-Data using:
`node extract_lootTables.js <version1,version2,...> <extractedDataFolder> <mcDataFolder>`

## add defaultState to a blocks.json

1. `node patch_states.js <version> blocks.json`

## add more accuracte drops to a blocks.json

1. `node extract_datafolder.js <version> out temp`
2. `node extract_block_lootTables.js <directory with blocks.json and items.json> out/<version>/`

## History

### 1.1.0
* [Update CI to Node 24 (#65)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/2b88f3f9e2431dcdb45e02f56ac6cf23c6176b49) (thanks @rom1504)
* [Fix publish workflow for trusted publishing (#64)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/9bb45e69d568db6d9bca24668980c124ef712a3d) (thanks @rom1504)
* [Switch to trusted publishing via OIDC (#63)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/82f74c76d24d7b72c4de0b951543abc870ecdc66) (thanks @rom1504)
* [Handle new model structure in 1.21.4 (#61)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/51aab330638862102dc962b22c714799f4a42699) (thanks @SuperGamerTron)
* [node 22 (#60)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/1406937ab4406512ac10577fbc59f32d75cb37b0) (thanks @rom1504)
* [Add command gh workflow allowing to use release command in comments (#59)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/f1cf968e20c46f56efbfc179d50dc9cf4403878c) (thanks @rom1504)
* [Update to node 18.0.0 (#58)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/0cec5e9b9dec42785e83aba0da9f5e1128f65d0f) (thanks @rom1504)
* [Bump mkdirp from 0.5.6 to 2.1.3 (#55)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/f40fbdd2bc7759143e7d35257b7124ea361f6730) (thanks @dependabot[bot])
* [Bump fs-extra from 10.1.0 to 11.1.0 (#52)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/c5726c442167227881ad654c270301d63b24c140) (thanks @dependabot[bot])
* [Bump standard from 16.0.4 to 17.0.0 (#50)](https://github.com/PrismarineJS/minecraft-jar-extractor/commit/97eafe70f2d3d5abc6e0472dcf2932eb36e10be7) (thanks @dependabot[bot])

### 1.0.0

* Everything

### 0.0.0

- imported from minecraft-data + description added
