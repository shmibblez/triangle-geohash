import { Point } from './Point';
import { Triangle } from './Triangle';
import { PrimaryTriangles } from './PrimaryTriangles';


export class TriangleGeohash {

    /**
     * approximate triangle side lengths
     */
    static get Depths() {
        return class Depths {
            static get km7050(): 0 { return 0 }
            static get km3525(): 1 { return 1 }
            static get km1762(): 2 { return 2 }
            static get km881(): 3 { return 3 }
            static get km440(): 4 { return 4 }
            static get km220(): 5 { return 5 }
            static get km110(): 6 { return 6 }
            static get km55(): 7 { return 7 }
            static get km27(): 8 { return 8 }
            static get km13(): 9 { return 9 }
            static get km6(): 10 { return 10 }
            static get km3(): 11 { return 11 }
            static get km1(): 12 { return 12 }
            static get km0_86(): 13 { return 13 }
            static get km0_43(): 14 { return 14 }
            static get km0_22(): 15 { return 15 }
            static get km0_11(): 16 { return 16 }
            static get km0_05(): 17 { return 17 }
        }
    };

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
