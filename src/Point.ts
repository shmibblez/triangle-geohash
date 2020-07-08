import {Conzts} from './conzts';
import {Utilz} from './Utilz';

/**
 * Point class, you could say this comment is pointless
 */
export class Point {

    x: number;
    y: number;
    z: number;
    lat: number;
    lon: number;
    /**
     * point constructor, degrees is default angle type
     */
    constructor(
        x: number,
        y: number,
        z: number,
        lat: number,
        lon: number,
        angleUnit: 'rad' | 'deg' = 'deg'
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
        if (angleUnit == 'rad') {
            this.lat = lat;
            this.lon = lon;
        } else {
            this.lat = Utilz.degToRad(lat);
            this.lon = Utilz.degToRad(lon);
        }
    }

    /**
     * gets midpoint between a and b that's also on sphere
     * @param a point a
     * @param b point b
     */
    static centerPoint(a: Point, b: Point): Point {
        let newLat: number, newLon: number;

        if (
            (a.lat === Math.PI / 2 && a.lon === 0) ||
            (a.lat === -Math.PI / 2 && a.lon === 0)
        ) {
            newLon = b.lon;
        } else if (
            (b.lat === Math.PI / 2 && b.lon === 0) ||
            (b.lat === -Math.PI / 2 && b.lon === 0)
        ) {
            newLon = a.lon;
        } else if (Math.abs(a.lon - b.lon) > Math.PI) {
            newLon =
                (-Math.sign(a.lon + b.lon) *
                    (Math.max(a.lon, b.lon) - Math.min(b.lon, a.lon))) /
                2;
        } else newLon = (a.lon + b.lon) / 2;

        newLat = (a.lat + b.lat) / 2;

        const r = Conzts.radius;
        // finds midpoint
        const avgX = (a.x + b.x) / 2;
        const avgY = (a.y + b.y) / 2;
        const avgZ = (a.z + b.z) / 2;
        // distance between origin and avg point
        const d = Math.sqrt(avgX * avgX + avgY * avgY + avgZ * avgZ);
        // "normalizes" point to be on sphere
        const x = (avgX / d) * r;
        const y = (avgY / d) * r;
        const z = (avgZ / d) * r;

        return new Point(x, y, z, newLat, newLon, 'rad');
    }

    /**
     * creates point from cartesian coordinates
     * @param x x-coordinate of location
     * @param y y-coordinate of location
     * @param z z-coordinate of location
     */
    static fromCart(x: number, y: number, z: number): Point {
        let r: number, lat: number, lon: number;

        r = Math.sqrt(x * x + y * y + z * z);
        lat = Math.asin(z / r);
        lon = Math.atan(y / x);

        return new Point(x, y, z, lat, lon, 'rad');
    }

    /**
     * creates point from lat/lon coordinates in degrees
     * @param lat latitude of location (degrees)
     * @param lon longitude of location (degrees)
     */
    static fromCoord(lat: number, lon: number): Point {
        let x: number, y: number, z: number, r: number, rz: number;

        // console.log('\n\nlat: ' + lat + ', lon: ' + lon + '\n\n');
        const latRad = Utilz.degToRad(lat);
        const lonRad = Utilz.degToRad(lon);
        r = Conzts.radius;
        // earthsRadius(false); // pass h for precision
        rz = Conzts.radius;
        x = r * Math.cos(latRad) * Math.cos(lonRad);
        y = r * Math.cos(latRad) * Math.sin(lonRad);
        z = rz * Math.sin(latRad);

        // console.log(
        //   '\n\nlat deg: ' +
        //     lat +
        //     '\nlon deg: ' +
        //     lon +
        //     '\nlatRad: ' +
        //     latRad +
        //     '\nlonRad: ' +
        //     lonRad +
        //     '\n\n'
        // );

        return new Point(x, y, z, latRad, lonRad, 'rad');
    }

    /**
     * checks if point is valid
     */
    isValid(): boolean {
        return (
            Number.isFinite(this.x) &&
            Number.isFinite(this.y) &&
            Number.isFinite(this.z)
        );
    }

    /**
     * VERY LOOSELY determines if points are on opposite sides of origin,
     * only used to compare point and its projection on a plane
     *
     * @returns true if points on opposite sides, false if not
     */
    isOnOppositeSide(a: Point): boolean {
        return (
            Math.sign(this.x) !== Math.sign(a.x) ||
            Math.sign(this.y) !== Math.sign(a.y) ||
            Math.sign(this.z) !== Math.sign(a.z)
        );
    }

    /**
     * @returns point with random location
     */
    static randomPoint() {
        const lat = Math.random() * 180 - 90;
        const lon = Math.random() * 360 - 180;

        return Point.fromCoord(lat, lon);
    }

}