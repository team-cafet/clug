const fs = require('fs');
const path = require('path');

/**
 * Copy all file in a source folder recursively to a target folder
 * @param {*} source 
 * @param {*} target 
 */
function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copying recursively all file
  // The algorithm is using recursivity
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      let curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

const PATH_TO_BACKEND = '../backend/';
const PATH_TO_BUILD_FOLDER = path.resolve('./build');
const PUBLIC_FOLDER_NAME = 'public';
const PATH_TO_PUBLIC = path.resolve(
  path.join(PATH_TO_BACKEND, PUBLIC_FOLDER_NAME)
);

if (!fs.existsSync(PATH_TO_BUILD_FOLDER)) {
  console.error('no build created...');
  return;
}

// Delete last public folder
console.log('Deleting backend public folder');
fs.rmdirSync(PATH_TO_PUBLIC, { recursive: true });

fs.mkdirSync(PATH_TO_PUBLIC);

// Copy build to the public folder
console.log('Copying build to public backend folder');
copyFolderRecursiveSync(path.join(PATH_TO_BUILD_FOLDER), PATH_TO_PUBLIC);

console.log('All done sucessfully !');
