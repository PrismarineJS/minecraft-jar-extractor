# minecraft-jar-extractor
[![NPM version](https://img.shields.io/npm/v/minecraft-jar-extractor.svg)](http://npmjs.com/package/minecraft-jar-extractor)

Extract structured data from the minecraft jar

## image name extractor

Just run `node image_names.js <version1,version2,...> <output_dir> <temporary_dir>` and get a directory containing the name->texture mapping and the textures.

Result of that currently online at [minecraft-assets](https://github.com/rom1504/minecraft-assets)

## protocol extractor

How to use it:

1. download the server jar (for example using [node-minecraft-wrap](https://github.com/rom1504/node-minecraft-wrap))
2. decompile it (for example using [fernflower](https://github.com/fesh0r/fernflower))
3. unzip it
4. node protocol_extractor decompiled_source/
5. get a protocol.json describing the classname<->id relation and some fields information

## History

### 0.0.0

* imported from minecraft-data + description added