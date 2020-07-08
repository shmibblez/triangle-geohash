import { Point } from './Point';
import { Triangle } from './Triangle';
import { PrimaryTriangles } from './PrimaryTriangles';


// TODO: add resolution class that has approximate km as property names and depth as values, like for example

/**
 * approximate triangle side lengths, rounded down, 
 * 
 * underscore is used as decimal point
 */
class Depths {
    static get km7050() { return 0 }
    static get km3525() { return 1 }
    static get km1762() { return 2 }
    static get km881() { return 3 }
    static get km440() { return 4 }
    static get km220() { return 5 }
    static get km110() { return 6 }
    static get km55() { return 7 }
    static get km27() { return 8 }
    static get km13() { return 9 }
    static get km6() { return 10 }
    static get km3() { return 11 }
    static get km1() { return 12 }
    static get km0_86() { return 13 }
    static get km0_43() { return 14 }
    static get km0_22() { return 15 }
    static get km0_11() { return 16 }
    static get km0_05() { return 17 }
}

export class TriangleGeohash {

    /**
     * approximate triangle side lengths
     */
    static get Depths() { return Depths };

    /**
     * generates triangle geohash for provided point
     * @param lat latitude of location
     * @param lon longitude of location
     * @param depth depth, use a value from TriangleGeohash.Depth (approximate triangle side lengths)
     * @returns array of triangle geohashes for all resolutions
     */
    static generateGeohashes(lat: number, lon: number, depth: number): string[] {
        // if (res > 20) throw new Error('res is too high, max is 20');

        const primaryTriangles = new PrimaryTriangles()

        const p = Point.fromCoord(lat, lon);
        const primaryParentTri = primaryTriangles.getTriContainingPoint(p);

        let hash = '' + primaryParentTri.pos + '|';

        const hashes: string[] = [];
        hashes.push(hash)

        let subTri!: Triangle;

        if (depth <= 0) return hashes;
        // return primaryParentTri;
        for (let c = 0; c < depth; c++) {
            if (!subTri) subTri = primaryParentTri.nextSubTriangle(p);
            else subTri = subTri.nextSubTriangle(p);
            hash += subTri.pos;
            hashes.push(hash);
        }
        return hashes;
    }

    /**
     * generates triangle geohash for provided point
     * @param lat latitude of location
     * @param lon longitude of location
     * @param res resolution, should be constant (TODO)
     * @returns triangle geohash for location
     */
    static generateGeohash(lat: number, lon: number, res: number): string {
        // if (res > 20) throw new Error('res is too high, max is 20');

        const primaryTriangles = new PrimaryTriangles()

        const p = Point.fromCoord(lat, lon);
        const primaryParentTri = primaryTriangles.getTriContainingPoint(p);

        let hash = '' + primaryParentTri.pos + '|';

        let subTri!: Triangle;

        if (res <= 0) return hash;
        // return primaryParentTri;
        for (let c = 0; c < res; c++) {
            if (!subTri) subTri = primaryParentTri.nextSubTriangle(p);
            else subTri = subTri.nextSubTriangle(p);
            hash += subTri.pos;
        }
        return hash;
    }
}

// TriangleGeohash.Depths = Depths;



// module.exports = TriangleGeohash;
// module.exports.Depths =
//     class Depths {
//         static get km5000() {
//             return '2'; // example
//         }
//     }

// if (typeof module != 'undefined' && module.exports) {
//     module.exports = TriangleGeohash;
// }
