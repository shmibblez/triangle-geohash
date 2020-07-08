const TriangleGeohash = require('/Users/shmibbles/dev/github-projects/triangle-geohash/lib/index').TriangleGeohash;
// const TriangleGeohash = require('/Users/shmibbles/dev/github-projects/triangle-geohash/triangle-geohash-0.0.1.tgz');

/**
 *
npm install /Users/shmibbles/dev/github-projects/triangle-geohash/triangle-geohash-0.0.1.tgz
 * 
 **/

const lat = 25;
const lon = -71;
const depth = TriangleGeohash.Depths.km440;
console.time('hashes')
const hashes = TriangleGeohash.generateGeohashes(lat, lon, depth);
console.timeEnd('hashes')
console.time('hash')
const hash = TriangleGeohash.generateGeohash(lat, lon, depth)
console.timeEnd('hash')


console.log('geohashes below')
console.log(hashes)
console.log('geohash below:')
console.log(hash)
console.log(TriangleGeohash.Depths.km7050)