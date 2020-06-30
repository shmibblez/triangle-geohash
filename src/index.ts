import { Point } from './Point';
import { Triangle } from './Triangle';
import { PrimaryTriangles } from './PrimaryTriangles';


class TriangleGeohash {

    primaryTriangles!: PrimaryTriangles;

    constructor() {
        if (!this.primaryTriangles) this.primaryTriangles = new PrimaryTriangles();
    }

    /**
     * generates triangle geohash for provided point
     * @param p point for which to get geohash
     * @param res resolution, should be constant (TODO)
     */
    generateGeohash(p: Point, res: number) {
        // if (res > 20) throw new Error('res is too high, max is 20');
        const primaryParentTri = this.primaryTriangles.getTriContainingPoint(p);

        let hash = '' + primaryParentTri.pos + '|';

        let subTri!: Triangle;

        if (res <= 0) return primaryParentTri;
        for (let c = 0; c < res; c++) {
            if (!subTri) subTri = primaryParentTri.nextSubTriangle(p);
            else subTri = subTri.nextSubTriangle(p);
            hash += subTri.pos;
        }
        console.log('geohash: ' + hash);
        return subTri;
    }
}

if (typeof module != 'undefined' && module.exports) {
    module.exports.TriangleGeohash = TriangleGeohash;
}
