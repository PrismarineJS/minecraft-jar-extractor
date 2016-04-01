const fernflower=require("fernflower");
const promisify = require("es6-promisify");
const downloadServer=promisify(require("minecraft-wrap").downloadServer);
const path=require("path");
const mkdirp=promisify(require("mkdirp"));

if(process.argv.length != 4) {
  console.log("Usage : node downloadDecompile.js <version> <output_dir>");
  process.exit(1);
}

const minecraftVersion=process.argv[2];
const outputDir=path.resolve(process.argv[3]);

const jarPath=path.join(outputDir,minecraftVersion+".jar");

mkdirp(outputDir)
  .then(() => downloadServer(minecraftVersion,jarPath))
  .then(() => fernflower(jarPath,outputDir,false))
  .then(decompiledDir => {
    console.log("Decompiled at "+decompiledDir);
  });