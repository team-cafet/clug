const fs = require('fs-extra');
const path = require('path');

const PATH_TO_BACKEND = '../backend/';
const PATH_TO_BUILD_FOLDER = path.resolve('./dist');
const PUBLIC_FOLDER_NAME = 'public/backoffice';
const PATH_TO_PUBLIC = path.resolve(
  path.join(PATH_TO_BACKEND, PUBLIC_FOLDER_NAME)
);

if (!fs.existsSync(PATH_TO_BUILD_FOLDER)) {
  console.error('no build created...');
  process.exit();
}

// Delete last public folder
console.log('Deleting backend public folder');
fs.rmSync(PATH_TO_PUBLIC, { recursive: true, force: true });

fs.mkdirSync(PATH_TO_PUBLIC, { recursive: true });

// Copy build to the public folder
console.log('Copying build to public backend folder');
fs.copySync(path.join(PATH_TO_BUILD_FOLDER), PATH_TO_PUBLIC);

console.log('All done sucessfully !');
