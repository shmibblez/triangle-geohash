# triangle-geohash

triangle-geohash is pretty much geohash but with triangles. Earth is split into an icosahedron, and each one of those triangles is split into 4 sub triangles. Hashes are formatted in the following way: `[primary triangle number]|[sub triangle number]...`, so for example, the triangle geohash for the bermuda triangle, coordinates (27,-71), with depth 12, would be `15|222223334412`, creepy huh?

# usage

**import**
```
import { TriangleGeohash } from 'triangle-geohash';
```
**init values**
```
const lat = 27
const lon = -71
const depth = TriangleGeohash.Depths.km440 // (4)
```
**then, you can either get the deepest hash**
```
const hash = TriangleGeohash.generateGeohash(lat, lon, depth)
// output: 15|2222
```
**or get an array of all included geohashes**
```
const hashes = TriangleGeohash.generateGeohashes(lat, lon, depth);
// output:
// [ '15|', '15|2', '15|22', '15|222', '15|2222' ]
```

# NOTE:
If used in an optional way (you store approximate user location if they allow it), wrap code in try/catch blocks and add if it doesn't fail, so it won't mess up the whole process, and then you can notify them or something, ex `failed to store approximate location`.

Also note use of the word approximate above, if you're storing sensitive locations, don't use too much precision.

# TODO
triangle-geohash is in its early stages and while it can generate geohashes, the idea is to find the closest hexagon/pentagon from a coordinate, to approximate a circle.

In order to do this, this is what needs to be done:
1. find the point nearest to the coordinate that's also a triangle vertex for the given depth
1. find the triangles surrounding that point for the given depth

Now, this is a lot easier said than done, and I haven't gotten there yet, so if you come up with something, I'll probably add it.