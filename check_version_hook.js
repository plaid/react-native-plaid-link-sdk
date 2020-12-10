const fs = require('fs');

const rn_version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))[
  'version'
];
const android_version = fs
  .readFileSync('android/src/main/AndroidManifest.xml', 'utf-8')
  .match(/(?<=value=").*(?=")/)[0];

if (rn_version != android_version) {
  console.error('Commit failed SDK version mismatch');
  console.error(
    'Please ensure package.json and android/src/main/AndroidManifest.xml have the same version',
  );
  process.exit(-1);
}
