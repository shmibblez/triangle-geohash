import { inspect } from 'util';

import { Point } from './Point';
import { Triangle } from './Triangle';
import { Utilz } from './Utilz';


export class PrimaryTriangles {

    tris: Triangle[];

    constructor() {
        this.tris = PrimaryTriangles.generatePrimaryIcosahedronTriangles();
    }

    /** triangle layout and numbering, fun fact: odd tris point up, even tris point down
     *
     * @returns triangle if found
     * @throws error if triangle not found
     *
     *       /\    /\    /\    /\    /\
     *      /1 \  /2 \  /3 \  /4 \  /5 \
     *     /____\/____\/____\/____\/____\ ____  ____  ____  ____
     *                             \    /\    /\    /\    /\    /\
     *                              \6 /7 \8 /9 \10/11\12/13\14/15\
     *                               \/____\/____\/____\/____\/____\ ____  ____  ____  ____
     *                                                        \    /\    /\    /\    /\    /
     *                                                         \16/  \17/  \18/  \19/  \20/
     *                                                          \/    \/    \/    \/    \/
     *
     * triangle layout
     *       A
     *       /\
     *      /2 \
     *   b /____\ c
     *    /\    /\
     *   /4 \1 /3 \
     *  /____\/____\
     * C     a      B
     *
     */
    getTriContainingPoint(p: Point): Triangle {
        let triNumsToCheck: number[];

        // // for testing
        // triNumsToCheck = [
        //   1,
        // 2,
        // 3,
        // 4,
        // 5,
        // 6,
        // 7,
        // 8,
        // 9,
        // 10,
        // 11,
        // 12,
        // 13,
        //   14,
        //   15,
        //   16,
        //   17,
        //   18,
        //   19,
        //   20,
        // ];

        const rad34Deg = Utilz.degToRad(34);
        const rad24Deg = Utilz.degToRad(24);
        const rad90Deg = Math.PI / 2;

        // below only checks necessary primary triangles (could be improved)
        if (p.lat <= rad34Deg && p.lat >= rad24Deg) {
            // if in small area where triangles "overlap", check top and middle tris
            triNumsToCheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        } else if (p.lat >= -rad34Deg && p.lat <= -rad24Deg) {
            // if in small area where triangles "overlap", check middle and bottom tris
            triNumsToCheck = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        } else if (p.lat >= rad34Deg && p.lat <= rad90Deg) {
            // if in top pent
            triNumsToCheck = [1, 2, 3, 4, 5];
        } else if (p.lat >= -rad24Deg && p.lat <= rad24Deg) {
            // if in center ring
            triNumsToCheck = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        } else if (p.lat <= -rad34Deg && p.lat >= -rad90Deg) {
            // if in bottom pent
            triNumsToCheck = [16, 17, 18, 19, 20];
        } else
            throw new Error(
                'invalid coordinates (probably not between [-90,90] for lat and [-180,180] lon' +
                '\nprovided coordinates:' +
                '\nlatitude: ' +
                p.lat +
                '\nlongitude: ' +
                p.lon
            );

        const tri = this._checkIfPointInTriangles(p, triNumsToCheck);

        return tri;
    }

    /**
     * checks if point in primary triangle
     *
     * @returns triangle if found
     * @throws error if triangle not found
     */
    _checkIfPointInTriangles(p: Point, triNums: number[]): Triangle {
        for (const num of triNums) {
            const tri: Triangle = this.tris[num - 1];
            const includesPoint = tri.includesPoint(p);
            if (includesPoint) return tri;
        }
        throw new Error(
            'v(): failed to get primary triangle including point, if youre reading this, please report to github, data: ' +
            '\n-------------------------' +
            '\npoint:\n\n' + inspect(p, undefined, null, true) +
            '\n-------------------------' +
            '\ntri nums:\n\n' + inspect(triNums, undefined, null, true) +
            '\n-------------------------' +
            '\nthis.tris:\n\n' + inspect(this.tris, undefined, null, true) +
            '\n-------------------------'
        );
    }

    static generatePrimaryIcosahedronTriangles(): Triangle[] {

        // angle between xy plane and bottom/top pent base points
        const angle = 26.6;

        // points on top pent
        const northPole = Point.fromCoord(90, 0);
        const north0 = Point.fromCoord(angle, 0);
        const north1 = Point.fromCoord(angle, 72);
        const north2 = Point.fromCoord(angle, 144);
        const north3 = Point.fromCoord(angle, -144);
        const north4 = Point.fromCoord(angle, -72);
        // points on bottom pent
        const southPole = Point.fromCoord(-90, 0);
        const south0 = Point.fromCoord(-angle, 36);
        const south1 = Point.fromCoord(-angle, 108);
        const south2 = Point.fromCoord(-angle, 180);
        const south3 = Point.fromCoord(-angle, -108);
        const south4 = Point.fromCoord(-angle, -36);

        return [
            /** triangle layout and numbering, fun fact: odd tris point up, even tris point down
             *
             *       /\    /\    /\    /\    /\
             *      /1 \  /2 \  /3 \  /4 \  /5 \
             *     /____\/____\/____\/____\/____\ ____  ____  ____  ____
             *                             \    /\    /\    /\    /\    /\
             *                              \6 /7 \8 /9 \10/11\12/13\14/15\
             *                               \/____\/____\/____\/____\/____\ ____  ____  ____  ____
             *                                                        \    /\    /\    /\    /\    /
             *                                                         \16/  \17/  \18/  \19/  \20/
             *                                                          \/    \/    \/    \/    \/
             *
             * triangle layout
             *       A
             *       /\
             *      /2 \
             *   b /____\ c
             *    /\    /\
             *   /4 \1 /3 \
             *  /____\/____\
             * C     a      B
             */
            // top triangles
            new Triangle(northPole, north1, north0, 1), // 1
            new Triangle(northPole, north2, north1, 2), // 2
            new Triangle(northPole, north3, north2, 3), // 3
            new Triangle(northPole, north4, north3, 4), // 4
            new Triangle(northPole, north0, north4, 5), // 5

            // center triangles
            new Triangle(south4, north4, north0, 6), // 6
            new Triangle(north0, south0, south4, 7), // 7
            new Triangle(south0, north0, north1, 8), // 8
            new Triangle(north1, south1, south0, 9), // 9
            new Triangle(south1, north2, north1, 10), // 10
            new Triangle(north2, south2, south1, 11), // 11
            new Triangle(south2, north3, north2, 12), // 12
            new Triangle(north3, south3, south2, 13), // 13
            new Triangle(south3, north4, north3, 14), // 14
            new Triangle(north4, south4, south3, 15), // 15

            // bottom triangles
            new Triangle(southPole, south3, south4, 16), // 16
            new Triangle(southPole, south4, south0, 17), // 17
            new Triangle(southPole, south0, south1, 18), // 18
            new Triangle(southPole, south1, south2, 19), // 19
            new Triangle(southPole, south2, south3, 20), // 20
        ];
    }
}
