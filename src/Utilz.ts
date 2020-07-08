// change name to Mafs
export class Utilz {

  // rename to toRadians
  static degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // rename to toDegrees
  static radToDeg(rad: number) {
    return rad * (180 / Math.PI);
  }

  /**
   * rounds numbers, if very small, round to more digits (this is a bit hacky but it works)
   * @param num number to round
   */
  static roundNums(num1: number, num2: number, places = 6): [number, number] {
    const pow1 = Utilz._decimalPlaces(num1);
    const pow2 = Utilz._decimalPlaces(num2);
    let pow = Math.min(pow1, pow2);

    if (pow > 5) pow -= places;

    return [Number(num1.toFixed(pow)), Number(num2.toFixed(pow))];
  }

  static _decimalPlaces(num: number) {
    const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    // console.log(match)
    return Math.max(
      0,
      (match[1] ? match[1].length : 0) // Number of digits right of decimal point.

      - (match[2] ? +match[2] : 0)); // Adjust for scientific notation.
  }
}
