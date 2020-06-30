import { Point } from './Point';
import { Vector } from './Vector';

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
    center!:Point;
    aMidpoint!: Point;
    bMidpoint!: Point;
    cMidpoint!: Point;

    static get UP() {
        return 1;
    }

    static get DOWN() {
        return -1;
    }
    // params are points
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

    static getSubTriangles(triangleArr: Triangle[], depth: number): Triangle[] {
        if (depth == 0) {
            console.log('depth is 0, returning');
            return [];
        }

        let triangles: Triangle[] = [];
        for (const triangle of triangleArr) {
            triangles = triangles.concat(triangle.generateSubTriangles());
        }
        return triangles.concat(this.getSubTriangles(triangles, depth - 1));
    }

    /**
     * only used for drawing triangles
     */
    static getOnlyDeepestSubTriangles(triangleArr: Triangle[], depth: number): Triangle[] {
        if (depth == 0) {
            // print('depth is 0, returning');
            return triangleArr;
        }
        if (!Array.isArray(triangleArr))
            throw new Error('array required as first param');
        if (typeof depth != 'number') throw new Error('depth required');

        let triangles: Triangle[] = [];
        for (const triangle of triangleArr) {
            triangles = triangles.concat(triangle.generateSubTriangles());
        }
        return this.getOnlyDeepestSubTriangles(triangles, depth - 1);
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
            'getSubTriangleContainingPoint(): failed to get sub triangle including point'
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
        if (p.isOnOppositeSide(intersection)) {
            console.log('point on opposite side');
            return false;
        }

        if (!intersection.isValid()) {
            console.log('point invalid');
            return false;
        }

        const thisArea = this.getArea();
        console.log('this area: ' + thisArea);

        // if any area is bigger than thisArea it means point outside of triangle
        const pABArea = new Triangle(this.A, this.B, intersection).getArea();
        if (pABArea > thisArea + 0.01) {
            console.log('pABArea bigger than this area');
            return false;
        }
        const pBCArea = new Triangle(intersection, this.B, this.C).getArea();
        if (pBCArea > thisArea + 0.01) {
            console.log('pBCArea bigger than this area');
            return false;
        }
        const pCAArea = new Triangle(this.A, intersection, this.C).getArea();
        if (pCAArea > thisArea + 0.01) {
            console.log('pCAArea bigger than this area');
            return false;
        }

        const combinedArea = pABArea + pBCArea + pCAArea;

        const areasEqual =
            Utilz.roundNum(thisArea) === Utilz.roundNum(combinedArea);

        console.log(
            '\nthisArea: ' +
            Utilz.roundNum(thisArea) +
            '\ncombined area: ' +
            Utilz.roundNum(combinedArea) +
            '\nareas equal?: ' +
            areasEqual +
            '\n--------------------'
        );

        // todo: might have to round a bit if calculations have rounding error,
        // but then need to consider that amount rounded off may mean that point
        // is in triangle next to this one by a very slight amount (rare edge case?)
        return areasEqual;
    }

    // TODO: what the hell man, rounding errors? (point from coordinates 27, 0 fails for some reason)
    includesPointV(p: Point): boolean {
        const intersection = this.getIntersection(p);
        // intersection.draw()
        // check if intersection on opposite side (check lat & lon?)
        if (p.isOnOppositeSide(intersection)) {
            console.log('point on opposite side');
            return false;
        }
        if (!intersection.isValid()) {
            console.log('point invalid');
            return false;
        }

        const vecA = new Vector(this.A);
        const vecB = new Vector(this.B);
        const vecC = new Vector(this.C);

        const includesPoint =
            Vector.sameSide(vecA, vecB, vecC, intersection) &&
            Vector.sameSide(vecC, vecA, vecB, intersection) &&
            Vector.sameSide(vecB, vecC, vecA, intersection);
        console.log('\n\nTriangle.includesPoint(): ' + includesPoint);
        return includesPoint;
    }

    includesPointBarycentric(p: Point): boolean {
        const vecA = new Vector(this.A);
        const vecB = new Vector(this.B);
        const vecC = new Vector(this.C);
        const vecP = new Vector(p);

        const vec0 = vecC.subtract(vecA);
        const vec1 = vecB.subtract(vecA);
        const vec2 = vecP.subtract(vecA);

        // // Compute vectors
        // v0 = C - A
        // v1 = B - A
        // v2 = P - A

        const dot00 = vec0.dotProduct(vec0);
        const dot01 = vec0.dotProduct(vec1);
        const dot02 = vec0.dotProduct(vec2);
        const dot11 = vec1.dotProduct(vec1);
        const dot12 = vec1.dotProduct(vec2);

        // // Compute dot products
        // dot00 = dot(v0, v0)
        // dot01 = dot(v0, v1)
        // dot02 = dot(v0, v2)
        // dot11 = dot(v1, v1)
        // dot12 = dot(v1, v2)

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // // Compute barycentric coordinates
        // invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
        // u = (dot11 * dot02 - dot01 * dot12) * invDenom
        // v = (dot00 * dot12 - dot01 * dot02) * invDenom

        console.log('\n\nv: ' + v + ', u: ' + u + '\n\n');

        return u >= 0 && v >= 0 && u + v < 1;

        // // Check if point is in triangle
        // return (u >= 0) && (v >= 0) && (u + v < 1)
    }

    /**
     * returns cross product / 2 which is area of triangle
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
        console.log('tri area: ' + area);

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

        // finds v (used to find point along vector from point p on plane)
        const vNumer = l * this.A.x + m * this.A.y + n * this.A.z;
        const vDenom = l * p.x + m * p.y + n * p.z;
        const v = vNumer / vDenom;

        // parametric equation for line from vector including origin (0, 0, 0) and point p
        const x = p.x * v;
        const y = p.y * v;
        const z = p.z * v;

        return Point.fromCart(x, y, z);
    }

    //

    /**
     * p5JS specific code below
     */

    //

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
