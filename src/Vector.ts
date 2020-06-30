import {Point} from './Point';
/**
 * vector class, pretty much point but adds utility methods
 */
export class Vector {

    x:number;
    y:number;
    z:number;

  constructor(p: Point | { x: number; y: number; z: number }) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
  }

  /**
   *        | x1 |      | x2 |                | (y1 * z2) - (y2 * z1) |
   * this = | y1 |  v = | y2 |     this ✕ v = | (z1 * x2) - (z2 * x1) |
   *        | z1 |      | z2 |                | (x1 * y2) - (x2 * y1) |
   */
  crossProduct(v: Vector): Vector {
    return new Vector({
      x: this.y * v.z - v.y * this.z,
      y: this.z * v.x - v.z * this.x,
      z: this.x * v.y - v.x * this.y,
    });
  }

  dotProduct(v: Vector): number {
    const dotProduct = this.x * v.x + this.y * v.y + this.z * v.z;
    console.log('\n\nVector.dotProduct(): ' + dotProduct);
    return dotProduct;
  }

  subtract(v: Vector) {
    return new Vector({ x: this.x - v.x, y: this.y - v.y, z: this.z - v.z });
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * checks if orthogonal vectors are on same side, if yes, return true, if no, false
   */
  static sameSide(v1: Vector, v2: Vector, v3: Vector, p: Point) {
    const pVec = new Vector(p);
    const vec1 = v2.subtract(v1).crossProduct(pVec.subtract(v1));
    const vec2 = v2.subtract(v1).crossProduct(v3.subtract(v1));

    // TODO: round depending on digits, so more precision with smaller numbers
    const dotProduct = vec1.dotProduct(vec2) + 0.001 >= 0;
    console.log('\n\nVector.sameSide(): ' + dotProduct);
    return dotProduct;
  }
}
