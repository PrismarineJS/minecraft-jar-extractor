const downloadClient = require("minecraft-wrap").downloadClient;
const extract = require('extract-zip');
const mkdirp = require("mkdirp");

function getMinecraftFiles(minecraftVersion,temporaryDir,cb) {
  const jarPath=temporaryDir+'/'+minecraftVersion+'.jar';
  const unzippedFilesDir=temporaryDir+'/'+minecraftVersion;
  mkdirp.sync(unzippedFilesDir);
  downloadClient(minecraftVersion, jarPath, function (err) {
    if(err) {
      cb(err);
      return;
    }
    extract(jarPath, {dir: unzippedFilesDir}, function (err) {
      if(err) {
        cb(err);
        return;
      }
      cb(null,unzippedFilesDir);
    });
  });
}

module.exports=getMinecraftFiles;

