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

## History

### 0.0.0

* imported from minecraft-data + description added