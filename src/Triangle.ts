import { Point } from './Point';
import { Vector } from './Vector';
import { Utilz } from './Utilz';
import { inspect } from 'util';


/**
 * defines a triangle
 *
 * how sub triangles are assigned:
 *       A
 *       /\
 *      /2 \
 *   b /____\ c       (center point is in center...)
 *    /\    /\
 *   /4 \1 /3 \
 *  /____\/____\
 * C     a      B
 * (primary triangles are set to 1)
 *
 */
export class Triangle {

    A: Point;
    B: Point;
    C: Point;
    pos: number;
    direction: number;
    center!: Point;
    aMidpoint!: Point;
    bMidpoint!: Point;
    cMidpoint!: Point;

    static get UP() {
        return 1;
    }

    static get DOWN() {
        return -1;
    }

    constructor(A: Point, B: Point, C: Point, pos = -1) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.pos = pos;
        this.direction = A.lat > B.lat ? Triangle.UP : Triangle.DOWN; // which way is triangle pointing?
        this.calculateSideCenterPoints();
    }

    /** creates child triangle objects (split below)
     *       A
     *       /\
     *      /2 \
     *   b /____\ c       (center point is in center...)
     *    /\    /\
     *   /4 \1 /3 \
     *  /____\/____\
     * C     a      B
     **/
    generateSubTriangles() {
        let subTriangles: Triangle[] = [];

        // center sub triangle
        subTriangles.push(
            new Triangle(this.aMidpoint, this.bMidpoint, this.cMidpoint, 1)
        );
        // A sub triangle
        subTriangles.push(new Triangle(this.A, this.cMidpoint, this.bMidpoint, 2));
        // B sub triangle
        subTriangles.push(new Triangle(this.cMidpoint, this.B, this.aMidpoint, 3));
        // C sub triangle
        subTriangles.push(new Triangle(this.bMidpoint, this.aMidpoint, this.C, 4));

        return subTriangles;
    }

    /**
     * @returns sub triangle that includes point
     */
    nextSubTriangle(p: Point): Triangle {
        const subTris = this.generateSubTriangles();
        for (const tri of subTris) {
            if (tri.includesPoint(p)) return tri;
        }
        throw new Error(
            'getSubTriangleContainingPoint(): failed to get sub triangle including point, if youre reading this, please report to github, data: ' +
            '\n-------------------------' +
            '\nsubtris:\n\n' + inspect(subTris, undefined, null, true) +
            '\n-------------------------'
        );
    }

    /**
     * checks if point in triangle
     *
     * @returns true if point in triangle, false if not
     */
    includesPoint(p: Point): boolean {
        const intersection = this.getIntersection(p);

        // check if intersection on opposite side (check lat & lon?)
        if (p.isOnOppositeSide(intersection)) return false;

        if (!intersection.isValid()) return false;

        const thisArea = this.getArea();

        // if any sub tri area is bigger than thisArea it means point outside of triangle
        const pABArea = new Triangle(this.A, this.B, intersection).getArea();
        if (pABArea > thisArea + 0.01) return false;

        const pBCArea = new Triangle(intersection, this.B, this.C).getArea();
        if (pBCArea > thisArea + 0.01) return false;

        const pCAArea = new Triangle(this.A, intersection, this.C).getArea();
        if (pCAArea > thisArea + 0.01) return false;


        const combinedArea = pABArea + pBCArea + pCAArea;

        const roundedNums = Utilz.roundNums(thisArea, combinedArea)
        const areasEqual = roundedNums[0] === roundedNums[1];

        // TODO: can rounding error cause false positive?
        return areasEqual;
    }

    /**
     * returns cross product ÷ 2 which is area of triangle
     *
     * @returns area of triangle
     */
    getArea() {
        const AVec = new Vector(this.A);
        const BVec = new Vector(this.B);
        const CVec = new Vector(this.C);

        const ABVec = AVec.subtract(BVec);
        const BCVec = BVec.subtract(CVec);

        const area = ABVec.crossProduct(BCVec).getMagnitude() / 2;

        return area;
    }

    /**
     * calculates point that is on this triangle's plane (defined by A, B, and C) that is also along line defined by p and origin
     *
     * @param p point
     * @returns point along line including origin and p that intersects this triangle's plane
     */
    getIntersection(p: Point): Point {

        // components of normal vector to plane containing this triangle's A, B, and C points
        const l = // x component
            (this.A.y - this.B.y) * (this.C.z - this.B.z) -
            (this.A.z - this.B.z) * (this.C.y - this.B.y);
        const m = // y component
            (this.A.z - this.B.z) * (this.C.x - this.B.x) -
            (this.A.x - this.B.x) * (this.C.z - this.B.z);
        const n = // z component
            (this.A.x - this.B.x) * (this.C.y - this.B.y) -
            (this.C.x - this.B.x) * (this.A.y - this.B.y);

        // finds v (variable - used to find point along vector from point p on plane)
        const vNumer = l * this.A.x + m * this.A.y + n * this.A.z;
        const vDenom = l * p.x + m * p.y + n * p.z;
        const v = vNumer / vDenom;

        // parametric equation for line from vector including origin (0, 0, 0) and point p
        const x = p.x * v;
        const y = p.y * v;
        const z = p.z * v;

        return Point.fromCart(x, y, z);
    }

    /**
     * sets midpoints between each vertex that are also on sphere
     */
    calculateSideCenterPoints() {
        this.aMidpoint = Point.centerPoint(this.B, this.C);

        this.bMidpoint = Point.centerPoint(this.C, this.A);

        this.cMidpoint = Point.centerPoint(this.A, this.B);

        const avgX = (this.aMidpoint.x + this.bMidpoint.x + this.cMidpoint.x) / 3;
        const avgY = (this.aMidpoint.y + this.bMidpoint.y + this.cMidpoint.y) / 3;
        const avgZ = (this.aMidpoint.z + this.bMidpoint.z + this.cMidpoint.z) / 3;

        this.center = Point.fromCart(avgX, avgY, avgZ);
    }
}





/**
 * BELOW ARE OTHER METHODS FOR CHECKING IF POINT IN TRIANGLE,
 *
 * IF YOURE READING THIS AND THINK ONE OF THESE HAS LESS ROUNDING ERROR,
 * OR IF THERE'S A BETTER WAY, PLEASE TELL ME, I'LL CHECK IT OUT
 */
    // // TODO: what the hell man, rounding errors? (point from coordinates (27, 0) fails for some reason)
    //.
    //
    // -------------------------------------------------- ORTHOGONAL VECTORS
    // includesPointV(p: Point): boolean {
    //     const intersection = this.getIntersection(p);

    //     if (p.isOnOppositeSide(intersection)) return false;

    //     if (!intersection.isValid()) return false;

    //     const vecA = new Vector(this.A);
    //     const vecB = new Vector(this.B);
    //     const vecC = new Vector(this.C);

    //     const includesPoint =
    //         Vector.sameSide(vecA, vecB, vecC, intersection) &&
    //         Vector.sameSide(vecC, vecA, vecB, intersection) &&
    //         Vector.sameSide(vecB, vecC, vecA, intersection);
    //     return includesPoint;
    // }
    //
    // 
    // -------------------------------------------------- BARYCENTRIC
    // includesPointBarycentric(p: Point): boolean {
    //     const vecA = new Vector(this.A);
    //     const vecB = new Vector(this.B);
    //     const vecC = new Vector(this.C);
    //     const vecP = new Vector(p);

    //     const vec0 = vecC.subtract(vecA);
    //     const vec1 = vecB.subtract(vecA);
    //     const vec2 = vecP.subtract(vecA);

    //     const dot00 = vec0.dotProduct(vec0);
    //     const dot01 = vec0.dotProduct(vec1);
    //     const dot02 = vec0.dotProduct(vec2);
    //     const dot11 = vec1.dotProduct(vec1);
    //     const dot12 = vec1.dotProduct(vec2);

    //     const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    //     const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    //     const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    //     return u >= 0 && v >= 0 && u + v < 1;
    // }
