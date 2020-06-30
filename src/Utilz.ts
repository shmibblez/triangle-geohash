// change name to Mafs
class Utilz {

    /**
     * passes degrees to trig function
     */
    static passDeg(trigFunc: Function, rad: number) {
      return trigFunc(rad * (180 / Math.PI));
    }
  
    /**
     * passes radians to trig function
     */
    static passRad(trigFunc: Function, rad: number) {
      return trigFunc(rad * (Math.PI / 180));
    }
  
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
    static roundNum(num: number) {
      let pow:number = 8;
      const regex = /[eE]-/;
      const match = regex.exec(num.toString());
      if (match) {
        const digits = Number(
          num.toString().substring(num.toString().indexOf(match[0]) + 2)
        );
        if (digits > 6) pow = digits + 6;
      }
  
      return Number(num.toFixed(pow));
    }
  }
  