const downloadClient = require("minecraft-wrap").downloadClient;

const mock = require('mock-fs');
const extract = require('extract-zip');

function getMinecraftFiles(minecraftVersion,cb) {
  const jarPath='/fake/'+minecraftVersion+'.jar';
  const unzippedFilesDir='/fake/'+minecraftVersion;
  const o={};
  o[unzippedFilesDir]={};
  mock(o);
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

