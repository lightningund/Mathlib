/**
 * Checks if a given object is of a given type
 * @param objToCheck The object you want to check is of type
 * @param props The properties of the object you want to check against
 * @returns whether the object is of specified type
 */
export const typeCheck = (objToCheck, ...props) => {
    for (let prop of props)
        try {
            if (!propertyCheck(objToCheck, prop))
                return false;
        }
        catch {
            return false;
        }
    return true;
};
export const propertyCheck = (objToCheck, prop) => prop in objToCheck;
/**
 * Set (for set theory stuff)
 * @class
 */
export class CSet {
    constructor(arr) {
        this.union = (otherSet) => CSet.union(this, otherSet);
        this.intersection = (otherSet) => CSet.intersection(this, otherSet);
        this.setDiff = (otherSet) => CSet.setDiff(this, otherSet);
        this.cartesianProduct = (otherSet) => CSet.cartesianProduct(this, otherSet);
        this.powerSet = () => CSet.powerSet(this);
        this.symDiff = (otherSet) => CSet.symDiff(otherSet, this);
        this.elems = arr !== undefined ? CSet.getElemsIfSet(arr) : [];
    }
}
CSet.IsSet = (obj) => typeCheck(obj, "elems");
CSet.createSetIfNot = (arr) => CSet.IsSet(arr) ? arr : { elems: arr };
CSet.getElemsIfSet = (arr) => CSet.IsSet(arr) ? arr.elems : arr;
CSet.loopThroughElems = (inSet, func) => {
    CSet.getElemsIfSet(inSet).forEach(i => func(i));
};
CSet.addGenSetToGenSet = (base, toAdd) => {
    CSet.loopThroughElems(toAdd, (elem) => {
        CSet.addToGenSet(base, elem);
    });
};
CSet.addToGenSet = (arr, elem) => {
    CSet.IsSet(arr) ? arr.elems.push(elem) : arr.push(elem);
};
CSet.removeDuplicateItemsFromGenSet = (arr) => {
    let outArr = [];
    CSet.loopThroughElems(arr, (elem) => {
        if (!CSet.elemIsInSet(elem, outArr)) {
            CSet.addToGenSet(elem, outArr);
        }
    });
    return new CSet(outArr);
};
CSet.elemIsInSet = (setIn, elem) => {
    let elems = CSet.createSetIfNot(setIn).elems;
    return elems.indexOf(elem) !== -1;
};
CSet.makeGenSetDense = (setIn) => new CSet(CSet.getElemsIfSet(setIn).filter(elem => elem !== null));
CSet.union = (a, b) => {
    const outArr = [];
    CSet.addGenSetToGenSet(outArr, a);
    CSet.addGenSetToGenSet(outArr, b);
    return CSet.removeDuplicateItemsFromGenSet(outArr);
};
CSet.intersection = (a, b) => {
    let outArr = [];
    CSet.loopThroughElems(a, (elem) => {
        if (CSet.elemIsInSet(elem, b)) {
            CSet.addToGenSet(elem, outArr);
        }
    });
    return new CSet(outArr);
};
CSet.setDiff = (a, b) => {
    let outArr = [];
    CSet.loopThroughElems(a, (elem) => {
        if (!CSet.elemIsInSet(elem, b)) {
            CSet.addToGenSet(elem, outArr);
        }
    });
    return new CSet(outArr);
};
CSet.cartesianProduct = (a, b) => {
    let outArr = [];
    CSet.loopThroughElems(a, (elemA) => {
        CSet.loopThroughElems(b, (elemB) => {
            CSet.addToGenSet(outArr, [elemA, elemB]);
        });
    });
    return new CSet(outArr);
};
CSet.powerSet = (a) => {
    let aSet = CSet.getElemsIfSet(a);
    let outArr = [];
    for (let index = 0; index < 2 ** aSet.length; index++) {
        let binaryString = index.toString(2);
        let binaryArr = binaryString.split("");
        binaryArr = padArr(binaryArr, aSet.length);
        let elemArr = [];
        binaryArr.forEach((e, i) => {
            if (e == "1")
                CSet.addToGenSet(elemArr, aSet[i]);
        });
        CSet.addToGenSet(outArr, elemArr);
    }
    return new CSet(outArr);
};
CSet.symDiff = (a, b) => CSet.setDiff(CSet.union(a, b), CSet.intersection(a, b));
/**
 * @class
 * @classdesc Color Class
 * @extends RGBColor
 * @extends HSVColor
 */
export class Color {
    constructor(...params) {
        this.getRGBHex = () => Color.getRGBHex(this);
        this.getRGBAHex = () => Color.getRGBAHex(this);
        this.getRGBFunc = () => Color.getRGBFunc(this);
        this.getRGBAFunc = () => Color.getRGBAFunc(this);
        let r = params[0];
        if (Color.IsRGBColor(r)) {
            this.r = r.r;
            this.g = r.g;
            this.b = r.b;
            if (typeof r.a !== undefined) {
                this.a = r.a;
            }
            else {
                this.a = params.length === 1 ? 255 : params[1];
            }
        }
        else {
            if (params.length == 0) {
                this.r = 0;
                this.g = 0;
                this.b = 0;
                this.a = 255;
            }
            else {
                this.r = params[0];
                this.g = params.length <= 2 ? params[0] : params[1];
                this.b = params.length <= 2 ? params[0] : params[2];
                this.a = params.length % 2 === 1 ? 255 : params.length == 2 ? params[1] : params[3];
            }
        }
    }
}
Color.IsRGBColor = (obj) => typeCheck(obj, "r", "g", "b");
Color.IsHSVColor = (obj) => typeCheck(obj, "h", "s", "v");
Color.IsColor = (obj) => Color.IsHSVColor(obj) || Color.IsRGBColor(obj);
Color.getRGBHex = (color) => {
    if (Color.IsHSVColor(color))
        return Color.getRGBHex(Color.HSVToRGB(color));
    return "#" + Color.hexOfColors(color.r, color.g, color.b).join("");
};
Color.getRGBAHex = (color) => {
    if (Color.IsHSVColor(color))
        return Color.getRGBAHex(Color.HSVToRGB(color));
    return Color.getRGBHex(color) + Color.hexOfColor(color.a, "ff");
};
Color.getRGBFunc = (color) => {
    if (Color.IsHSVColor(color))
        return Color.getRGBFunc(Color.HSVToRGB(color));
    return "rgb(" + Color.limitColors(color.r, color.g, color.b).join(", ") + ")";
};
Color.getRGBAFunc = (color) => {
    if (Color.IsHSVColor(color))
        return Color.getRGBAFunc(Color.HSVToRGB(color));
    return "rgba(" + Color.limitColors(color.r, color.g, color.b, color.a).join(", ") + ")";
};
Color.hexOfColors = (...colors) => {
    return colors.map(color => Color.hexOfColor(color));
};
Color.limitColors = (...colors) => {
    return colors.map(color => Color.limitColor(color));
};
Color.hexOfColor = (val, def) => val ? (Color.limitColor(val) < 16 ? "0" : "") + val.toString(16) : def ? def : "00";
Color.limitColor = (val) => val ? limit(val, 0, 256) : 0;
Color.RGBtoHSV = (colorIn) => {
    let Cmax = Math.max(colorIn.r, colorIn.g, colorIn.b);
    let Cmin = Math.min(colorIn.r, colorIn.g, colorIn.b);
    let delta = Cmax - Cmin;
    let a = colorIn.a;
    let H = 60 * (delta == 0 ? 0 :
        Cmax == colorIn.r ? ((colorIn.g - colorIn.b) / delta) % 6 :
            Cmax == colorIn.g ? ((colorIn.b - colorIn.r) / delta) + 4 :
                ((colorIn.r - colorIn.g) / delta) + 2);
    let S = Cmax == 0 ? 0 : delta / Cmax;
    return {
        h: H,
        s: S,
        v: Cmax,
        a: (a === undefined ? 255 : a)
    };
};
/**
 * Convert a color in HSV format to RGB format
 */
Color.HSVToRGB = (colorIn) => {
    let h = colorIn.h;
    let s = colorIn.s;
    let v = colorIn.v;
    let a = colorIn.a;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    let r, g, b;
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    r *= 256;
    g *= 256;
    b *= 256;
    return {
        r, g, b,
        a: (a === undefined ? 255 : a)
    };
};
/** @constant @default 0x000000FF */
Color.Black = new Color(0, 0, 0, 255);
/** @constant @default 0x808080FF */
Color.Grey = new Color(128, 128, 128, 255);
/** @constant @default 0x808080FF */
Color.Gray = new Color(128, 128, 128, 255);
/** @constant @default 0xFFFFFFFF */
Color.White = new Color(255, 255, 255, 255);
/** @constant @default 0xFF0000FF */
Color.Red = new Color(255, 0, 0, 255);
/** @constant @default 0x00FF00FF */
Color.Green = new Color(0, 255, 0, 255);
/** @constant @default 0x0000FFFF */
Color.Blue = new Color(0, 0, 255, 255);
/** @constant @default 0xFFFF00FF */
Color.Yellow = new Color(255, 255, 0, 255);
/** @constant @default 0xFF00FFFF */
Color.Purple = new Color(255, 0, 255, 255);
/** @constant @default 0x00FFFFFF */
Color.Cyan = new Color(0, 255, 255, 255);
/** @constant @default 0xFF8000FF */
Color.Orange = new Color(255, 128, 0, 255);
/**
 * Helper class for 2D vectors
 * @class
 */
export class Vector2 {
    constructor(x, y) {
        this.copy = () => new Vector2(this);
        this.add = (addend) => {
            let n = Vector2.add(this, addend);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.sub = (subtrahend) => {
            let n = Vector2.sub(this, subtrahend);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.scale = (scalar) => {
            let n = Vector2.scale(this, scalar);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.addBoth = (addend) => {
            let n = Vector2.addBoth(this, addend);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.setBoth = (val) => {
            let n = Vector2.setBoth(this, val);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.rotate = (angle) => {
            let n = Vector2.rotate(this, angle);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.normalize = () => {
            let n = Vector2.normalize(this);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.limit = (...minMaxIn) => {
            let n = Vector2.limit(this, ...minMaxIn);
            this.x = n.x;
            this.y = n.y;
            return this;
        };
        this.heading = () => Vector2.heading(this);
        this.squareLength = () => Vector2.squareLength(this);
        this.len = () => Vector2.len(this);
        this.distSquared = (a) => Vector2.distSquared(a, this);
        this.dist = (a) => Vector2.dist(a, this);
        if (x !== undefined) {
            if (Vector2.IsVector2(x)) {
                this.x = x.x;
                this.y = x.y;
            }
            else {
                this.x = x;
                this.y = y !== undefined ? y : x;
            }
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    }
}
Vector2.IsVector2 = (obj) => typeCheck(obj, "x", "y");
/**
 * Take a vector and create a new Vector2 from it
 */
Vector2.copy = (vec) => new Vector2(vec);
/**
 * Add two vectors
 */
Vector2.add = (a, b) => new Vector2(a.x + b.x, a.y + b.y);
/**
 * Subtract two vectors
 */
Vector2.sub = (a, b) => new Vector2(a.x - b.x, a.y - b.y);
/**
 * Scale a vector by a set value
 */
Vector2.scale = (vec, scalar) => new Vector2(vec.x * scalar, vec.y * scalar);
/**
 * Add a flat value to both values of the vector
 */
Vector2.addBoth = (vec, addend) => new Vector2(vec.x + addend, vec.y + addend);
Vector2.setBoth = (vec, val) => {
    let tempVec = Vector2.copy(vec);
    tempVec.x = val;
    tempVec.y = val;
    return tempVec;
};
Vector2.rotate = (vec, angle) => new Vector2(vec.x * Math.cos(angle) - vec.y * Math.sin(angle), vec.x * Math.sin(angle) + vec.y * Math.cos(angle));
/**
 * Normalize a vector (scale it so it's length is 1)
 */
Vector2.normalize = (vec) => Vector2.scale(vec, 1 / Vector2.len(vec));
/**
 * Limit a vector to a rectangle defined by the lower and upper limits forming the corners
 */
Vector2.limit = (limitee, ...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, new Vector2(-1, -1), new Vector2(1, 1));
    return new Vector2(limit(limitee.x, minMax[0].x, minMax[1].x), limit(limitee.y, minMax[0].y, minMax[1].y));
};
/**
 * Find the angle of a vector
 */
Vector2.heading = (vec) => {
    let a = Math.atan2(vec.x, vec.y);
    a = a < 0 ? Math.PI * 2 + a : a;
    return a;
};
/**
 * Find the length of a vector but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
Vector2.squareLength = (vec) => Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
/**
 * Find the length of a vector
 */
Vector2.len = (vec) => Math.sqrt(Vector2.squareLength(vec));
/**
 * Find the Distance between two vectors but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
Vector2.distSquared = (a, b) => Vector2.squareLength(Vector2.sub(a, b));
/**
 * Find the Distance between two vectors
 */
Vector2.dist = (a, b) => Math.sqrt(Vector2.distSquared(a, b));
Vector2.fromAngle = (angle) => new Vector2(Math.sin(angle), Math.cos(angle));
/**
 * Helper class for 3D vectors
 * @class
 */
export class Vector3 {
    constructor(x, y, z) {
        this.copy = () => new Vector3(this);
        this.add = (addend) => {
            let n = Vector3.add(this, addend);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.sub = (subtrahend) => {
            let n = Vector3.sub(this, subtrahend);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.scale = (scalar) => {
            let n = Vector3.scale(this, scalar);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.addAll = (addend) => {
            let n = Vector3.addAll(this, addend);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.setAll = (val) => {
            this.x = val;
            this.y = val;
            this.z = val;
            return this;
        };
        this.rotate = (rx, ry, rz) => {
            let n = Vector3.rotate(this, rx, ry, rz);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.rotateAround = (axis, angle) => {
            let n = Vector3.rotateAround(this, axis, angle);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.normalize = () => {
            let n = Vector3.normalize(this);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.limit = (...minMaxIn) => {
            let n = Vector3.limit(this, ...minMaxIn);
            this.x = n.x;
            this.y = n.y;
            this.z = n.z;
            return this;
        };
        this.heading = () => Vector3.heading(this);
        this.squareLength = () => Vector3.squareLength(this);
        this.len = () => Vector3.len(this);
        this.distSquared = (a) => Vector3.distSquared(a, this);
        this.dist = (a) => Vector3.dist(a, this);
        this.x = 0;
        this.y = 0;
        this.z = z !== undefined ? z : 0;
        if (x !== undefined) {
            if (Vector3.IsVector3(x)) {
                this.x = x.x;
                this.y = x.y;
                this.z = x.z;
            }
            else if (Vector2.IsVector2(x)) {
                this.x = x.x;
                this.y = x.y;
            }
            else {
                this.x = x;
                if (y !== undefined) {
                    if (Vector2.IsVector2(y)) {
                        this.y = y.x;
                        this.z = y.y;
                    }
                }
            }
        }
    }
}
Vector3.IsVector3 = (obj) => typeCheck(obj, "x", "y", "z");
/**
 * Take a vector and create a new Vector3 from it
 */
Vector3.copy = (vec) => new Vector3(vec);
/**
 * Add two vectors
 */
Vector3.add = (a, b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
/**
 * Subtract two vectors
 */
Vector3.sub = (a, b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
/**
 * Scale a vector by a set value
 */
Vector3.scale = (vec, scalar) => new Vector3(vec.x * scalar, vec.y * scalar, vec.z * scalar);
/**
 * Add a flat value to both values of the vector
 */
Vector3.addAll = (vec, addend) => new Vector3(vec.x + addend, vec.y + addend, vec.z + addend);
Vector3.setAll = (val) => new Vector3(val, val, val);
Vector3.makeRotationMatrix = (rx, ry, rz) => [
    [
        cos(rz) * cos(ry),
        cos(rz) * sin(ry) * sin(rx) - sin(rz) * cos(rx),
        cos(rz) * sin(ry) * cos(rx) + sin(rz) * sin(rx)
    ],
    [
        sin(rz) * cos(ry),
        sin(rz) * sin(ry) * sin(rx) + cos(rz) * cos(rx),
        sin(rz) * sin(ry) * cos(rx) - cos(rz) * sin(rx)
    ],
    [
        -sin(ry),
        cos(ry) * sin(rx),
        cos(ry) * cos(rx)
    ]
];
Vector3.rotate = (vec, rx, ry, rz) => {
    let arr = Vector3.makeRotationMatrix(rx, ry, rz);
    return new Vector3(vec.x * arr[0][0] + vec.y * arr[0][1] + vec.z * arr[0][2], vec.x * arr[1][0] + vec.y * arr[1][1] + vec.z * arr[1][2], vec.x * arr[2][0] + vec.y * arr[2][1] + vec.z * arr[2][2]);
};
Vector3.makeRotationMatrixAroundAxis = (axis, angle) => [
    [
        cos(angle) + Math.pow(axis.x, 2) * (1 - cos(angle)),
        axis.x * axis.y * (1 - cos(angle)) - axis.z * sin(angle),
        axis.x * axis.z * (1 - cos(angle)) + axis.y * sin(angle)
    ],
    [
        axis.y * axis.x * (1 - cos(angle)) + axis.z * sin(angle),
        cos(angle) + Math.pow(axis.y, 2) * (1 - cos(angle)),
        axis.y * axis.z * (1 - cos(angle)) - axis.x * sin(angle)
    ],
    [
        axis.z * axis.x * (1 - cos(angle)) - axis.y * sin(angle),
        axis.z * axis.y * (1 - cos(angle)) + axis.x * sin(angle),
        cos(angle) + Math.pow(axis.z, 2) * (1 - cos(angle))
    ]
];
Vector3.rotateAround = (vec, axis, angle) => {
    let arr = Vector3.makeRotationMatrixAroundAxis(axis, angle);
    return new Vector3(vec.x * arr[0][0] + vec.y * arr[0][1] + vec.z * arr[0][2], vec.x * arr[1][0] + vec.y * arr[1][1] + vec.z * arr[1][2], vec.x * arr[2][0] + vec.y * arr[2][1] + vec.z * arr[2][2]);
};
/**
 * Normalize a vector (scale it so it's length is 1)
 */
Vector3.normalize = (vec) => Vector3.scale(vec, 1 / Vector3.len(vec));
/**
 * Limit a vector to a Box3D defined by the lower and upper limits forming the corners
 */
Vector3.limit = (limitee, ...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, new Vector3(-1, -1, -1), new Vector3(1, 1, 1));
    return new Vector3(limit(limitee.x, minMax[0].x, minMax[1].x), limit(limitee.y, minMax[0].y, minMax[1].y), limit(limitee.z, minMax[0].z, minMax[1].z));
};
/**
 * Find the angle of a vector using spherical coordinates
 * @returns [phi, theta]
 */
Vector3.heading = (vec) => {
    let XYVec = new Vector2(vec.x, vec.y);
    let Phi = XYVec.heading();
    let PhiZVec = new Vector2(vec.z, XYVec.len());
    let Theta = PhiZVec.heading();
    return [Phi, Theta];
};
/**
 * Find the length of a vector but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
Vector3.squareLength = (vec) => Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
/**
 * Find the length of a vector
 */
Vector3.len = (vec) => Math.sqrt(Vector3.squareLength(vec));
/**
 * Find the Distance between two vectors but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
Vector3.distSquared = (a, b) => Vector3.squareLength(Vector3.sub(a, b));
/**
 * Find the Distance between two vectors
 */
Vector3.dist = (a, b) => Math.sqrt(Vector3.distSquared(a, b));
Vector3.fromAngle = (phi, theta) => {
    let XYVec = Vector2.fromAngle(phi);
    let PhiZVec = Vector2.fromAngle(theta);
    return new Vector3(XYVec, PhiZVec.x);
};
/**
 * Helper class for N-Dim vectors
 * @class
 */
export class VectorN {
    constructor(base) {
        this.copy = () => new VectorN(this);
        this.add = (addend) => {
            let n = VectorN.add(this, addend);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.sub = (subtrahend) => {
            let n = VectorN.sub(this, subtrahend);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.scale = (scalar) => {
            let n = VectorN.scale(this, scalar);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.addAll = (addend) => {
            let n = VectorN.addAll(this, addend);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.setAll = (val) => {
            this.coords = this.coords.map(_elem => val);
            return this;
        };
        this.normalize = () => {
            let n = VectorN.normalize(this);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.limit = (...minMaxIn) => {
            let n = VectorN.limit(this, ...minMaxIn);
            this.coords = n.coords.slice(0, n.coords.length);
            return this;
        };
        this.squareLength = () => VectorN.squareLength(this);
        this.len = () => VectorN.len(this);
        this.distSquared = (a) => VectorN.distSquared(a, this);
        this.dist = (a) => VectorN.dist(a, this);
        this.coords = [];
        if (base !== undefined) {
            if (Vector2.IsVector2(base)) {
                this.coords[0] = base.x;
                this.coords[1] = base.y;
            }
            else if (Vector3.IsVector3(base)) {
                this.coords[0] = base.x;
                this.coords[1] = base.y;
                this.coords[2] = base.z;
            }
            else if (VectorN.IsVectorN(base)) {
                this.coords = base.coords.slice(0, base.coords.length);
            }
            else {
                this.coords = base.slice(0, base.length);
            }
        }
    }
}
VectorN.IsVectorN = (obj) => typeCheck(obj, "coords");
/**
 * Take a vector and create a new VectorN from it
 */
VectorN.copy = (vec) => new VectorN(vec);
/**
 * Add two vectors
 */
VectorN.add = (a, b) => new VectorN(a.coords.map((elem, ind) => elem + b.coords[ind]));
/**
 * Subtract two vectors
 */
VectorN.sub = (a, b) => new VectorN(a.coords.map((elem, ind) => elem - b.coords[ind]));
/**
 * Scale a vector by a set value
 */
VectorN.scale = (vec, scalar) => new VectorN(vec.coords.map(elem => elem * scalar));
/**
 * Add a flat value to both values of the vector
 */
VectorN.addAll = (vec, addend) => new VectorN(vec.coords.map(elem => elem + addend));
VectorN.setAll = (vec, val) => new VectorN(vec.coords.map(_elem => val));
/**
 * Normalize a vector (scale it so it's length is 1)
 */
VectorN.normalize = (vec) => VectorN.scale(vec, 1 / VectorN.len(vec));
/**
 * Limit a vector to a Box3D defined by the lower and upper limits forming the corners
 */
VectorN.limit = (limitee, ...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, VectorN.setAll(limitee, -1), VectorN.setAll(limitee, 1));
    return new VectorN(limitee.coords.map((elem, ind) => limit(elem, minMax[0][ind], minMax[1][ind])));
};
/**
 * Find the length of a vector but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
VectorN.squareLength = (vec) => {
    let sum = 0;
    vec.coords.forEach(elem => sum += Math.pow(elem, 2));
    return sum;
};
/**
 * Find the length of a vector
 */
VectorN.len = (vec) => Math.sqrt(VectorN.squareLength(vec));
/**
 * Find the Distance between two vectors but squared
 * (saves on resources because Math.sqrt is pretty expensive computationally)
 */
VectorN.distSquared = (a, b) => VectorN.squareLength(VectorN.sub(a, b));
/**
 * Find the Distance between two vectors
 */
VectorN.dist = (a, b) => Math.sqrt(VectorN.distSquared(a, b));
export class LineInf2D {
    /**
     * @constructor
     * @param source The source point
     * @param angleOrDest Either the angle or another point on the line
     */
    constructor(source, angleOrDest) {
        this.source = source;
        this.angle = Vector2.IsVector2(angleOrDest) ? Vector2.heading(Vector2.sub(angleOrDest, source)) : angleOrDest;
    }
}
export class LineInf3D {
    /**
     * @constructor
     * @param source The source point
     * @param dest Another reference point on the line
     */
    constructor(source, dest) {
        this.source = source;
        let angles = Vector3.sub(dest, source).heading();
        this.angle = angles[0];
        this.theta = angles[1];
    }
}
export class LineSegment2D {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}
export class LineSegment3D {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}
export class CRange {
    constructor(start, size) {
        this.start = start;
        this.size = size;
    }
}
/**
 * General 2d rectangle
 * @class
 */
export class Box2D {
    //#endregion
    constructor(a, b, c, d) {
        this.getCenter = () => Box2D.getCenter(this);
        this.render = (context) => {
            context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        };
        posAndSize(this, a, b, c, d);
    }
}
Box2D.IsBox2D = (obj) => typeCheck(obj, "pos", "size");
Box2D.getCenter = (Box2D) => Vector2.add(Box2D.pos, Vector2.scale(Box2D.size, 1 / 2));
/**
 * General 3d cuboid
 * @class
 */
export class Box3D {
    constructor(pos, size) {
        this.getCenter = () => Box3D.getCenter(this);
        this.pos = new Vector3(pos);
        this.size = new Vector3(size);
    }
}
Box3D.IsBox3D = (obj) => typeCheck(obj, "pos", "size");
Box3D.getCenter = (Box3D) => Vector3.add(Box3D.pos, Vector3.scale(Box3D.size, 1 / 2));
/**
 * General 3d cuboid
 * @class
 */
export class BoxND {
    constructor(pos, size) {
        this.getCenter = () => BoxND.getCenter(this);
        this.pos = new VectorN(pos);
        this.size = new VectorN(size);
    }
}
BoxND.IsBoxND = (obj) => typeCheck(obj, "pos", "size");
BoxND.getCenter = (Box3D) => VectorN.add(Box3D.pos, VectorN.scale(Box3D.size, 1 / 2));
export class Circle {
    constructor(centerPos, rad) {
        this.center = new Vector2(centerPos);
        this.radius = rad;
    }
}
Circle.IsCircle = (obj) => typeCheck(obj, "center", "radius");
export class Sphere {
    constructor(centerPos, rad) {
        this.center = new Vector3(centerPos);
        this.radius = rad;
    }
}
Sphere.IsSphere = (obj) => typeCheck(obj, "center", "radius");
export class NSphere {
    constructor(centerPos, rad) {
        this.center = new VectorN(centerPos);
        this.radius = rad;
    }
}
NSphere.IsNSphere = (obj) => typeCheck(obj, "center", "radius");
/**
 * Helper class for a rectangular 2D collider
 * @class
 */
export class Collider2 extends Box2D {
    //#endregion
    constructor(a, b, c, d) {
        super(a, b, c, d);
        this.checkCollision = (colliders, callbacks) => {
            const nextPosX = Vector2.add(this.pos, { x: this.vel.x, y: 0 });
            const nextPosY = Vector2.add(this.pos, { x: 0, y: this.vel.y });
            const nextColX = new Collider2(nextPosX, this.size);
            const nextColY = new Collider2(nextPosY, this.size);
            let hit = false;
            for (let col of colliders) {
                if (col === this)
                    continue;
                if (IntersectionBetween.Box2DAndBox2D(col, nextColY)) {
                    if (this.vel.y > 0)
                        cbCheck(callbacks.ypos, true, col);
                    else
                        cbCheck(callbacks.yneg, true, col);
                    cbCheck(callbacks.yany, true, col);
                    hit = true;
                }
                if (IntersectionBetween.Box2DAndBox2D(col, nextColX)) {
                    if (this.vel.x > 0)
                        cbCheck(callbacks.xpos, true, col);
                    else
                        cbCheck(callbacks.xneg, true, col);
                    cbCheck(callbacks.xany, true, col);
                    hit = true;
                }
                cbCheck(callbacks.any, hit, col);
                if (hit)
                    return;
            }
        };
        this.wallLimit = (bounds, callbacks) => {
            if (isLimited(this.pos.x, bounds.x - this.size.x)) {
                this.vel.x = 0;
                cbCheck(callbacks.x, true);
            }
            if (isLimited(this.pos.y, bounds.y - this.size.y)) {
                this.vel.y = 0;
                cbCheck(callbacks.y, true);
            }
            this.pos.limit(Vector2.sub(bounds, this.size));
        };
        this.subUpdate = (updates) => {
            this.pos.add(Vector2.scale(this.vel, 1 / (updates ? updates : 1)));
        };
        this.update = () => { this.vel.add(this.acc); };
        this.vel = new Vector2();
        this.acc = new Vector2();
    }
}
Collider2.IsCollider2 = (obj) => Box2D.IsBox2D(obj) && typeCheck(obj, "vel", "acc");
/**
 * Helper class for a cuboid 3D collider
 * @class
 */
export class Collider3 extends Box3D {
    constructor(pos, size) {
        super(pos, size);
        this.checkCollision = (colliders, callbacks) => {
            let nextPosX = Vector3.add(this.pos, { x: this.vel.x, y: 0, z: 0 });
            let nextPosY = Vector3.add(this.pos, { x: 0, y: this.vel.y, z: 0 });
            let nextPosZ = Vector3.add(this.pos, { x: 0, y: 0, z: this.vel.z });
            let nextColX = new Collider3(nextPosX, this.size);
            let nextColY = new Collider3(nextPosY, this.size);
            let nextColZ = new Collider3(nextPosZ, this.size);
            let hit = false;
            for (let col of colliders) {
                if (col == this)
                    continue;
                if (IntersectionBetween.Box3DAndBox3D(col, nextColX)) {
                    if (this.vel.x > 0)
                        cbCheck(callbacks.xpos, true, col);
                    else
                        cbCheck(callbacks.xneg, true, col);
                    hit = true;
                }
                if (IntersectionBetween.Box3DAndBox3D(col, nextColY)) {
                    if (this.vel.y > 0)
                        cbCheck(callbacks.ypos, true, col);
                    else
                        cbCheck(callbacks.yneg, true, col);
                    hit = true;
                }
                if (IntersectionBetween.Box3DAndBox3D(col, nextColZ)) {
                    if (this.vel.z > 0)
                        cbCheck(callbacks.zpos, true, col);
                    else
                        cbCheck(callbacks.zneg, true, col);
                    hit = true;
                }
                cbCheck(callbacks.general, hit, col);
            }
        };
        this.wallLimit = (bounds, callbacks) => {
            if (isLimited(this.pos.x, bounds.x - this.size.x)) {
                this.vel.x = 0;
                cbCheck(callbacks.x, true);
            }
            if (isLimited(this.pos.y, bounds.y - this.size.y)) {
                this.vel.y = 0;
                cbCheck(callbacks.y, true);
            }
            if (isLimited(this.pos.z, bounds.z - this.size.z)) {
                this.vel.z = 0;
                cbCheck(callbacks.z, true);
            }
            this.pos.limit(Vector3.sub(bounds, this.size));
        };
        this.subUpdate = (updates) => {
            this.pos.add(Vector3.scale(this.vel, 1 / (updates ? updates : 1)));
        };
        this.update = () => { this.vel.add(this.acc); };
        this.vel = new Vector3();
        this.acc = new Vector3();
    }
}
Collider3.IsCollider3 = (obj) => Box2D.IsBox2D(obj) && typeCheck(obj, "vel", "acc");
/**
 * Helper class for a cuboid 3D collider
 * @class
 */
export class ColliderN extends BoxND {
    constructor(pos, size) {
        super(pos, size);
        this.checkCollision = (colliders, callbacks) => {
            for (let col of colliders) {
                let hit = false;
                for (let dim of this.pos.coords) {
                    let nextPos = VectorN.add(this.pos, { coords: this.vel.coords.map((elem, ind) => ind == dim ? elem : 0) });
                    let nextCol = new ColliderN(nextPos, this.size);
                    if (col == this)
                        continue;
                    if (IntersectionBetween.BoxNDAndBoxND(col, nextCol)) {
                        if (this.vel.coords[dim] > 0)
                            cbCheck(callbacks.pos[dim], true, col);
                        else
                            cbCheck(callbacks.neg[dim], true, col);
                        hit = true;
                    }
                }
                cbCheck(callbacks.general, hit, col);
            }
        };
        this.wallLimit = (bounds, callbacks) => {
            this.pos.coords.forEach((elem, ind) => {
                if (isLimited(elem, bounds.coords[ind] - this.size.coords[ind])) {
                    this.vel.coords[ind] = 0;
                    cbCheck(callbacks[ind], true);
                }
            });
            this.pos.limit(VectorN.sub(bounds, this.size));
        };
        this.subUpdate = (updates) => {
            this.pos.add(VectorN.scale(this.vel, 1 / (updates ? updates : 1)));
        };
        this.update = () => { this.vel.add(this.acc); };
        this.vel = VectorN.setAll(pos, 0);
        this.acc = VectorN.setAll(pos, 0);
    }
}
ColliderN.IsColliderN = (obj) => BoxND.IsBoxND(obj) && typeCheck(obj, "vel", "acc");
/**
 * Helper class for an arbitrary button
 * @class
 */
export class Button extends Box2D {
    constructor(onClick, a = 0, b = 0, c = 0, d = 0) {
        super(a, b, c, d);
        this.wasClicked = (clickPos) => IntersectionBetween.Point2DAndBox2D(clickPos, this);
        this.onClick = onClick;
    }
}
Button.IsButton = (obj) => Box2D.IsBox2D(obj) && typeCheck(obj, "onClick");
export const ImageFromSrc = (src) => {
    let tempImg = new Image();
    tempImg.src = src;
    return tempImg;
};
/**
 * Helper Class for a playing card
 * @class
 */
export class Card {
    constructor(a, b, f) {
        this.getVal = () => Card.getVal(this);
        this.flip = () => { this.flipped = !this.flipped; return this; };
        if (Card.IsCard(a)) {
            this.numI = a.numI;
            this.suitI = a.suitI;
            this.flipped = a.flipped;
        }
        else {
            this.numI = b !== undefined ? b : 0;
            this.suitI = a !== undefined ? a : 0;
            this.flipped = f !== undefined ? f : false;
        }
        this.num = Card.CARDVALS[this.numI];
        this.suit = Card.SUITS[this.suitI];
        this.name = this.num + this.suit;
        this.sprite = new Image(1000, 1000);
        this.sprite.src = "https://lightningund.github.io/Methlib/Images/" + this.suit + this.num + ".png";
    }
}
Card.IsCard = (obj) => typeCheck(obj, "numI", "suitI", "num", "suit", "name", "flipped", "sprite");
Card.SUITS = ['C', 'S', 'H', 'D'];
Card.CARDVALS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
Card.cardBack = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Back.png");
Card.cardHighlight = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Highlight.png");
Card.cardOutline = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Outline.png");
Card.getVal = (card) => {
    switch (card.num) {
        case "A":
            return 1;
        case "J":
        case "Q":
        case "K":
            return 10;
        default:
            return parseInt(card.num);
    }
};
Card.flip = (card) => {
    let temp = new Card(card);
    temp.flipped = !temp.flipped;
    return temp;
};
/**
 * Helper Class for a deck of playing cards
 * @class
 */
export class Deck {
    constructor() {
        this.shuffle = () => { this.cards = randomize(this.cards); };
        this.takeTopCard = () => this.cards.splice(0, 1)[0];
        this.takeNthCard = (n) => this.cards.splice(n, 1)[0];
        this.addCard = (newCard) => { this.cards.push(newCard); };
        this.addCards = (newCards) => { this.cards.push(...newCards); };
        this.cards = [];
        for (let i = 0; i < Card.SUITS.length; i++) {
            for (let j = 0; j < Card.CARDVALS.length; j++) {
                this.cards.push(new Card(i, j));
            }
        }
    }
}
Deck.IsDeck = (obj) => typeCheck(obj, "cards");
Deck.shuffle = (deck) => {
    let temp = new Deck();
    temp.cards = randomize(deck.cards);
    return temp;
};
//#endregion
//#endregion
//#region Canvas
export var EllipseMode;
(function (EllipseMode) {
    EllipseMode[EllipseMode["CENTER"] = 0] = "CENTER";
    EllipseMode[EllipseMode["CORNER"] = 1] = "CORNER";
})(EllipseMode || (EllipseMode = {}));
export var RectMode;
(function (RectMode) {
    RectMode[RectMode["CENTER"] = 0] = "CENTER";
    RectMode[RectMode["CORNER"] = 1] = "CORNER";
})(RectMode || (RectMode = {}));
export var ColorMode;
(function (ColorMode) {
    ColorMode[ColorMode["RGB"] = 0] = "RGB";
    ColorMode[ColorMode["HSV"] = 1] = "HSV";
})(ColorMode || (ColorMode = {}));
export class Canvas {
    constructor(canv) {
        this.strokeOff = false;
        this.fillOff = false;
        this.background = (col) => {
            let w = this.canv.width;
            let h = this.canv.height;
            this.ctxt.save();
            this.ctxt.fillStyle = Color.getRGBAHex(col);
            this.ctxt.fillRect(0, 0, w, h);
            this.ctxt.restore();
        };
        this.ellipse = (x, y, width, height) => {
            let xRad = width / 2;
            let yRad = height / 2;
            this.ctxt.beginPath();
            this.ctxt.ellipse(x, y, xRad, yRad, 0, 0, Math.PI * 2);
            this.fillOrStroke();
        };
        this.rect = (x, y, width, height) => {
            this.ctxt.beginPath();
            this.ctxt.rect(x, y, width, height);
            this.fillOrStroke();
        };
        this.line = (x1, y1, x2, y2) => {
            if (!this.strokeOff) {
                this.ctxt.beginPath();
                this.ctxt.moveTo(x1, y1);
                this.ctxt.lineTo(x2, y2);
                this.ctxt.stroke();
            }
        };
        this.point = (x, y) => {
            if (!this.strokeOff) {
                this.line(x, y, x, y);
            }
        };
        this.font = (fontStr) => {
            this.ctxt.font = fontStr;
        };
        this.text = (str, x, y) => {
            if (!this.fillOff) {
                this.ctxt.fillText(str, x, y);
            }
            if (!this.strokeOff) {
                this.ctxt.strokeText(str, x, y);
            }
        };
        this.arc = (x, y, radius, startAngle, endAngle) => {
            this.ctxt.beginPath();
            this.ctxt.arc(x, y, radius, startAngle, endAngle);
            1;
            this.fillOrStroke();
        };
        this.noStroke = () => {
            this.strokeOff = true;
        };
        this.stroke = (col) => {
            this.ctxt.strokeStyle = Color.getRGBAHex(col);
            this.strokeOff = false;
        };
        this.strokeWeight = (weight) => {
            this.ctxt.lineWidth = weight;
        };
        this.noFill = () => {
            this.fillOff = true;
        };
        this.fill = (col) => {
            this.ctxt.fillStyle = Color.getRGBAHex(col);
            this.fillOff = false;
        };
        this.ellipseMode = (newMode) => {
            this.currentEllipseMode = newMode;
        };
        this.rectMode = (newMode) => {
            this.currentRectMode = newMode;
        };
        this.colorMode = (newMode) => {
            this.currentColorMode = newMode;
        };
        this.fillOrStroke = () => {
            if (!this.fillOff) {
                this.ctxt.fill();
            }
            if (!this.strokeOff) {
                this.ctxt.stroke();
            }
        };
        this.canv = canv;
        this.ctxt = canv.getContext("2d");
    }
}
//#endregion
//#endregion
//#region Constants
//#region Exported
export const E = 2.7182818;
export const PI = 3.1415926;
export const PHI = 1.6180339;
//#endregion
//#region Internal
const romChars = ['I', 'V', 'X', 'L', 'D', 'C', 'M', 'v', 'x', 'l', 'd', 'c', 'm'];
const romVals = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
let maxVal = romVals[romVals.length - 1] * 3;
for (let i = 0; i < romVals.length / 2; i++) {
    maxVal += romVals[i * 2 + 1];
}
const MRV = maxVal;
//#endregion
//#endregion
//#region Functions
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
/**
 * Determines the minimum and maximum of an array of things of varying lengths
 * @param minMax The array of things passed in
 * @param defMin The default minimum
 * @param defMax The default maximum
 * @returns an array of the min and max
 */
const minAndMax = (minMax, defMin, defMax) => {
    let min = minMax.length > 1 ? minMax[0] : defMin;
    let max = minMax.length > 1 ? minMax[1] : minMax.length > 0 ? minMax[0] : defMax;
    return [min, max];
};
const cbCheck = (cb, cond, ...params) => {
    if (cb !== undefined && cond)
        cb(params);
};
const posAndSize = (obj, a, b, c, d) => {
    if (a !== undefined) {
        if (Box2D.IsBox2D(a)) {
            obj.pos = a.pos;
            obj.size = a.size;
        }
        else if (Vector2.IsVector2(a)) {
            obj.pos = Vector2.copy(a);
            obj.size = new Vector2(...(Vector2.IsVector2(b) ? [b] : [b, c]));
        }
        else {
            obj.pos = new Vector2(a, b);
            obj.size = new Vector2(...(Vector2.IsVector2(c) ? [c] : [c, d]));
        }
    }
    else {
        obj.pos = new Vector2(0, 0);
        obj.size = new Vector2(0, 0);
    }
};
const timeForm = (val, measurement) => val.toString() + measurement + (val > 1 ? "s" : "");
export const padArr = (inArr, targetLen, padStr) => {
    let padWith = padStr === undefined ? ["0"] : Array.from(padStr);
    for (let i = inArr.length; i < targetLen; i += padWith.length) {
        inArr.unshift(...padWith);
    }
    for (let i = inArr.length; i > targetLen; i--) {
        inArr.shift();
    }
    return inArr;
};
//#region Checkers
//#region IntersectionChecks
// List
// 2D: Point2D, LineInf2D, LineSeg2D, Box2D, Circle (25 checks, 15 unique)
// (PO.PO ✓, PO.LI ✓, PO.LS ✓, PO.BO ✓, PO.CI ✓, LI.LI, LI.LS, LI.BO ✓, LI.CI ✓, LS.LS, LS.BO, LS.CI ✓, BO.BO ✓, BO.CI ✓, CI.CI ✓)
// 3D: Point3D, LineInf3D, LineSeg3D, Box3D, SPOhere (25 checks, 15 unique)
// (PO.PO, PO.LI, PO.LS, PO.BO ✓, PO.SP ✓, LI.LI, LI.LS, LI.BO, LI.SP ✓, LS.LS, LS.BO, LS.SP ✓, BO.BO ✓, BO.SP ✓, SP.SP ✓)
// ND: PointND, Box3DND, SPhereND (9 checks, 6 unique)
// (PO.PO, PO.BO, PO.SP, BO.BO ✓, BO.SP, SP.SP)
export class IntersectionBetween {
}
//range & range
IntersectionBetween.RangeAndRange = (a, b) => (a.start + a.size >= b.start) && (b.start + b.size >= a.start);
//point & range
IntersectionBetween.Point1DAndRange = (point, range) => point > range.start && point < range.start + range.size;
//#region 2D
//Point2D & Point2D
IntersectionBetween.Point2DAndPoint2D = (pointA, pointB) => pointA.x == pointB.x && pointA.y == pointB.y;
//Point2D & Line2DInf
IntersectionBetween.Point2DAndLineInf2D = (point, line) => line.angle == Vector2.sub(line.source, point).heading();
//Point2D & Line2DSeg
IntersectionBetween.Point2DAndLineSegment2D = (point, line) => {
    const pointToAVec = Vector2.sub(line.a, point);
    const pointToBVec = Vector2.sub(line.b, point);
    const AToBVec = Vector2.sub(line.b, line.a);
    const withinARange = pointToAVec.squareLength() < AToBVec.squareLength();
    const withinBRange = pointToBVec.squareLength() < AToBVec.squareLength();
    return AToBVec.heading() == pointToAVec.heading() && withinARange && withinBRange;
};
//Point2D & Box2D
IntersectionBetween.Point2DAndBox2D = (point, Box2D) => {
    const xRange = new CRange(Box2D.pos.x, Box2D.size.x);
    const xOverlap = IntersectionBetween.Point1DAndRange(point.x, xRange);
    const yRange = new CRange(Box2D.pos.y, Box2D.size.y);
    const yOverlap = IntersectionBetween.Point1DAndRange(point.y, yRange);
    return xOverlap && yOverlap;
};
//Point2D & Circle
IntersectionBetween.Point2DAndCircle = (point, circle) => Vector2.dist(point, circle.center) <= circle.radius;
//Line2DInf & Line2DInf
//Line2DInf & Line2DSeg
//Line2DInf & Box2D
IntersectionBetween.LineInf2DAndBox2D = (line, Box2D) => {
    const Box2DCorners = [
        Box2D.pos,
        Vector2.add(Box2D.pos, { x: Box2D.size.x, y: 0 }),
        Vector2.add(Box2D.pos, { x: 0, y: Box2D.size.y }),
        Vector2.add(Box2D.pos, Box2D.size)
    ];
    const pointToCornerLines = Box2DCorners.map(corner => new LineInf2D(line.source, corner));
    const pointToCornerAngles = pointToCornerLines.map(PTCL => PTCL.angle);
    const angleA = Math.max(...pointToCornerAngles);
    const angleB = Math.min(...pointToCornerAngles);
    return line.angle < angleA && line.angle > angleB;
};
//Line2DInf & Circle
IntersectionBetween.LineInf2DAndCircle = (line, circle) => {
    const lineA = line.source;
    const lineB = Vector2.add(line.source, Vector2.fromAngle(line.angle));
    const center = circle.center;
    // const a = (lineB.x - lineA.x) ** 2 + (lineB.y - lineA.y) ** 2;
    // const b = 2 * ((lineB.x - lineA.x) * (lineA.x - center.x) + (lineB.y - lineA.y) * (lineA.y - center.y));
    // const c = center.x ** 2 + center.y ** 2 + lineA.x ** 2 + lineA.y ** 2 - 2 * (center.x * lineA.x + center.y * lineA.y) - circle.radius ** 2;
    // const u = b ** 2 - 4 * a * c;
    // return u > 0;
    const lineDX = lineB.x - lineA.x;
    const lineDY = lineB.y - lineA.y;
    const num = (center.x - lineA.x) * lineDX + (center.y - lineA.y) * lineDY;
    const den = lineDX ** 2 + lineDY ** 2;
    const u = num / den;
    const p = Vector2.add(lineB, Vector2.scale(Vector2.sub(lineB, lineA), u));
    return IntersectionBetween.Point2DAndCircle(p, circle);
};
//Line2DSeg & Line2DSeg
//Line2DSeg & Box2D
//Line2DSeg & Circle
IntersectionBetween.LineSeg2DAndCircle = (line, circle) => {
    const center = circle.center;
    const lineDX = line.b.x - line.a.x;
    const lineDY = line.b.y - line.a.y;
    const num = (center.x - line.a.x) * lineDX + (center.y - line.a.y) * lineDY;
    const den = lineDX ** 2 + lineDY ** 2;
    const u = num / den;
    if (u > 0 && u < 1) {
        const p = Vector2.add(line.a, Vector2.scale(Vector2.sub(line.b, line.a), u));
        return IntersectionBetween.Point2DAndCircle(p, circle);
    }
    else {
        return IntersectionBetween.Point2DAndCircle(line.a, circle) || IntersectionBetween.Point2DAndCircle(line.b, circle);
    }
};
//Box2D & Box2D
IntersectionBetween.Box2DAndBox2D = (a, b) => {
    const xa = new CRange(a.pos.x, a.size.x);
    const xb = new CRange(b.pos.x, b.size.x);
    const ya = new CRange(a.pos.y, a.size.y);
    const yb = new CRange(b.pos.y, b.size.y);
    return (IntersectionBetween.RangeAndRange(xa, xb) && IntersectionBetween.RangeAndRange(ya, yb));
};
//Box2D & Circle
IntersectionBetween.Box2DAndCircle = (Box2D, circle) => {
    const x = limit(circle.center.x, Box2D.pos.x, Box2D.pos.x + Box2D.size.x);
    const y = limit(circle.center.y, Box2D.pos.y, Box2D.pos.y + Box2D.size.y);
    return Vector2.dist(new Vector2(x, y), circle.center) < circle.radius;
};
//Circle & Circle
IntersectionBetween.CircleAndCircle = (a, b) => {
    const dist = Vector2.dist(a.center, b.center);
    return dist < a.radius && dist < b.radius;
};
//#endregion
//#region 3D
//Point3D & Point3D
//Point3D & Line3DInf
//Point3D & Line3DSeg
//Point3D & Box3D
IntersectionBetween.Point3DAndBox3D = (point, Box3D) => {
    const xRange = new CRange(Box3D.pos.x, Box3D.size.x);
    const xOverlap = IntersectionBetween.Point1DAndRange(point.x, xRange);
    const yRange = new CRange(Box3D.pos.y, Box3D.size.y);
    const yOverlap = IntersectionBetween.Point1DAndRange(point.y, yRange);
    const zRange = new CRange(Box3D.pos.z, Box3D.size.z);
    const zOverlap = IntersectionBetween.Point1DAndRange(point.z, zRange);
    return xOverlap && yOverlap && zOverlap;
};
//Point3D & sphere
IntersectionBetween.Point3DAndSphere = (point, circle) => Vector3.dist(point, circle.center) <= circle.radius;
//Line3DInf & Line3D
//Line3DInf & Line3DSeg
//Line3DInf & Box3D
//Line3DInf & sphere
IntersectionBetween.LineInf3DAndSphere = (line, sphere) => {
    const lineA = line.source;
    const lineB = Vector3.add(line.source, Vector3.fromAngle(line.angle, line.theta));
    const center = sphere.center;
    // const a = (lineB.x - lineA.x) ** 2 + (lineB.y - lineA.y) ** 2 + (lineB.z - lineA.z) ** 2;
    // const b = 2 * ((lineB.x - lineA.x) * (lineA.x - center.x) + (lineB.y - lineA.y) * (lineA.y - center.y) + (lineB.z - lineA.z) * (lineA.z - center.z));
    // const c = center.x ** 2 + center.y ** 2 + center.z ** 2 + lineA.x ** 2 + lineA.y ** 2 + lineA.z ** 2 - 2 * (center.x * lineA.x + center.y * lineA.y + center.z * lineA.z) - sphere.radius ** 2;
    // const u = b ** 2 - 4 * a * c;
    // return u > 0;
    const lineDX = lineB.x - lineA.x;
    const lineDY = lineB.y - lineA.y;
    const lineDZ = lineB.z - lineA.z;
    const num = (center.x - lineA.x) * lineDX + (center.y - lineA.y) * lineDY + (center.z - lineA.z) * lineDZ;
    const den = lineDX ** 2 + lineDY ** 2 + lineDZ ** 2;
    const u = num / den;
    const p = Vector3.add(lineA, Vector3.scale(Vector3.sub(lineB, lineA), u));
    return IntersectionBetween.Point3DAndSphere(p, sphere);
};
//Line3DSeg & Line3DSeg
//Line3DSeg & Box3D
//Line3DSeg & Sphere
IntersectionBetween.LineSeg3DAndSphere = (line, sphere) => {
    const center = sphere.center;
    const lineDX = line.b.x - line.a.x;
    const lineDY = line.b.y - line.a.y;
    const lineDZ = line.b.z - line.a.z;
    const num = (center.x - line.a.x) * lineDX + (center.y - line.a.y) * lineDY + (center.z - line.a.z) * lineDZ;
    const den = lineDX ** 2 + lineDY ** 2 + lineDZ ** 2;
    const u = num / den;
    if (u > 0 && u < 1) {
        const p = Vector3.add(line.a, Vector3.scale(Vector3.sub(line.b, line.a), u));
        return IntersectionBetween.Point3DAndSphere(p, sphere);
    }
    else {
        return IntersectionBetween.Point3DAndSphere(line.a, sphere) || IntersectionBetween.Point3DAndSphere(line.b, sphere);
    }
};
//Box3D & Box3D
IntersectionBetween.Box3DAndBox3D = (a, b) => {
    const xya = new Box2D(new Vector2(a.pos.x, a.pos.y), new Vector2(a.size.x, a.size.y));
    const xyb = new Box2D(new Vector2(b.pos.x, b.pos.y), new Vector2(b.size.x, b.size.y));
    const xza = new Box2D(new Vector2(a.pos.x, a.pos.z), new Vector2(a.size.x, a.size.z));
    const xzb = new Box2D(new Vector2(b.pos.x, b.pos.z), new Vector2(b.size.x, b.size.z));
    const yza = new Box2D(new Vector2(a.pos.y, a.pos.z), new Vector2(a.size.y, a.size.z));
    const yzb = new Box2D(new Vector2(b.pos.y, b.pos.z), new Vector2(b.size.y, b.size.z));
    return (IntersectionBetween.Box2DAndBox2D(xya, xyb) && IntersectionBetween.Box2DAndBox2D(xza, xzb) && IntersectionBetween.Box2DAndBox2D(yza, yzb));
};
//Box3D & Sphere
IntersectionBetween.Box3DAndSphere = (Box3D, sphere) => {
    const x = limit(sphere.center.x, Box3D.pos.x, Box3D.pos.x + Box3D.size.x);
    const y = limit(sphere.center.y, Box3D.pos.y, Box3D.pos.y + Box3D.size.y);
    const z = limit(sphere.center.z, Box3D.pos.z, Box3D.pos.z + Box3D.size.z);
    return Vector3.dist(new Vector3(x, y, z), sphere.center) < sphere.radius;
};
//Sphere & Sphere
IntersectionBetween.SphereAndSphere = (a, b) => {
    const dist = Vector3.dist(a.center, b.center);
    return dist < a.radius && dist < b.radius;
};
//#endregion
//#region ND
//PointND & PointND
//PointND & BoxND
//PointND & SphereND
//BoxND & BoxND
IntersectionBetween.BoxNDAndBoxND = (a, b) => {
    const aRanges = a.pos.coords.map((elem, ind) => new CRange(elem, a.size.coords[ind]));
    const bRanges = b.pos.coords.map((elem, ind) => new CRange(elem, b.size.coords[ind]));
    let overlap = true;
    aRanges.forEach((elem, ind) => { if (!IntersectionBetween.RangeAndRange(elem, bRanges[ind]))
        overlap = false; });
    return overlap;
};
//#endregion
/** Brute force prime checker */
export const isPrime = (val) => {
    for (let i = 2; i < Math.sqrt(val); i++) {
        if (isPrime(i)) {
            if (gcd(i, val) != 1) {
                return false;
            }
        }
    }
    return true;
};
/** Determines if two numbers are coprime to each other */
export const areCoprime = (a, b) => gcd(a, b) == 1;
/** Check if a given value would be truncated with the given lower and upper limits */
export const isLimited = (limitee, ...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, 0, 1);
    return (limitee <= minMax[0] || limitee >= minMax[1]);
};
//#endregion
//#region Math
/** The logarithm of a number with an arbitrary base */
export const logb = (val, base) => Math.log(val) / Math.log(base);
/** Return the greatest common denominator */
export const gcd = (a, b) => {
    while (true) {
        if (a > b) {
            a -= b;
        }
        else if (b > a) {
            b -= a;
        }
        else {
            return a;
        }
    }
};
/** Return the lowest common multiple */
export const lcm = (a, b) => (a * b) / gcd(a, b);
/**
 * More efficient use of ^ and % together by using the modulus throughout the power-ing
 * @param b Base
 * @param e Exponent
 * @param m Modulus
 * @returns (b^e) % m
 */
export const modPow = (b, e, m) => {
    let modPow = 1;
    for (let i = 0; i < e; i++) {
        modPow *= b;
        modPow %= m;
    }
    return modPow;
};
/** No Idea */
export const eTot = (val) => {
    let numCoprimes = 0;
    for (let i = 0; i < val; i++) {
        if (gcd(i, val) == 1) {
            numCoprimes++;
        }
    }
    return numCoprimes;
};
//TODO:Figure out what the hell is happening with this and why it just doesn't work sometimes
/** No Idea */
export const carmichael = (val) => {
    let m = 0;
    let coprimes = findCoprimesLessThan(val);
    while (m < val * 10) {
        m++;
        let success = true;
        for (let a of coprimes) {
            if (Math.pow(a, m) % val != 1) {
                success = false;
                break;
            }
        }
        if (!success) {
            continue;
        }
        else {
            return m;
        }
    }
    return -1;
};
/** No Idea */
export const extendedEuclid = (a, b) => {
    let s = 0;
    let old_s = 1;
    let t = 1;
    let old_t = 0;
    let r = b;
    let old_r = a;
    let quot = 0;
    let temp = 0;
    while (r != 0) {
        quot = old_r / r;
        temp = r;
        r = old_r - quot * temp;
        old_r = temp;
        temp = s;
        s = old_s - quot * temp;
        old_s = temp;
        temp = t;
        t = old_t - quot * temp;
        old_t = temp;
    }
    return old_s;
};
/** Find all numbers that are less than n and are coprime to it */
export const findCoprimesLessThan = (n) => {
    let coprimes = [];
    for (let i = 0; i < n; i++) {
        if (areCoprime(i, n)) {
            coprimes.push(i);
        }
    }
    return coprimes;
};
/** Return an array of numbers coprime to n of length len */
export const findCoprimeList = (n, len) => {
    let coprimes = [];
    let checkNum = 1;
    while (coprimes.length < len) {
        if (areCoprime(checkNum, n)) {
            coprimes.push(checkNum);
        }
        checkNum++;
    }
    return coprimes;
};
//#endregion
//#region DoStuff
/** Return a truncated version of a value between the lower and upper limits */
export const limit = (limitee, ...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, 0, 1);
    if (limitee <= minMax[0])
        return minMax[0];
    if (limitee >= minMax[1])
        return minMax[1];
    return limitee;
};
/** RSA encryption */
export const RSAEncrypt = (message, n, k) => {
    let BEM = [];
    let CA = message.split("");
    for (let i in CA) {
        let NC = parseInt(CA[i]);
        BEM[i] = modPow(NC, k, n);
    }
    return BEM;
};
/** RSA decryption */
export const RSADecrypt = (ENCMess, n, j) => {
    let message = "";
    for (let i of ENCMess) {
        let NC = modPow(i, j, n);
        message += NC.toString();
    }
    return message;
};
/** Generate an MLA Citation */
export const MLA_Citation = (quote, act, scene, lineStart, lineEnd) => {
    let modQuote;
    if (lineEnd - lineStart < 2) {
        modQuote = quote;
    }
    else {
        let quoteWords = quote.split(" ");
        modQuote = quoteWords[0] + " " + quoteWords[1] + " ... " + quoteWords[quoteWords.length - 2] + " " + quoteWords[quoteWords.length - 1];
    }
    return "'" + modQuote + "' (" + romanNumerals(act) + ", " + scene + ", " + lineStart + "-" + lineEnd + ")";
};
/**
 * Formats a time from a number into something human-readable
 * @param time The time to format in seconds
 * @returns A formatted string with days, hours, minutes, and seconds
 */
export const prettyTime = (time) => {
    let seconds = time;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    let out_string = [];
    if (days > 0) {
        out_string.push(timeForm(days, " day"));
    }
    if (hours > 0) {
        out_string.push(timeForm(hours, " hour"));
    }
    if (minutes > 0) {
        out_string.push(timeForm(minutes, " minute"));
    }
    if (seconds > 0) {
        out_string.push(timeForm(seconds, " second"));
    }
    return out_string.join(", ");
};
/** Generate the Roman numeral equivalent of a given number */
export const romanNumerals = (val) => {
    let romanNum = "";
    let tenthPower = Math.ceil(logb(val, 10)) + 1;
    if (val > MRV)
        throw "Number too large";
    for (let i = tenthPower; i > 0; i--) {
        let workingString = "";
        let operatingNum = Math.floor(val / Math.pow(10, i - 1));
        operatingNum -= Math.floor(val / Math.pow(10, i)) * 10;
        //check which of 4 general categories the digit is in:1-3, 4, 5-8, 9 (there is probably a much better way to do this)
        if (operatingNum < 4) {
            for (let j = 0; j < operatingNum; j++) {
                workingString += romChars[(i - 1) * 2];
            }
        }
        else if (operatingNum == 4) {
            workingString = romChars[(i - 1) * 2] + romChars[(i - 1) * 2 + 1];
        }
        else if (operatingNum == 5) {
            workingString = romChars[(i - 1) * 2 + 1];
        }
        else if (operatingNum == 9) {
            workingString = romChars[(i - 1) * 2] + romChars[i * 2];
        }
        else {
            workingString = romChars[(i - 1) * 2 + 1];
            for (let j = 0; j < operatingNum - 5; j++) {
                workingString += romChars[(i - 1) * 2];
            }
        }
        romanNum += workingString;
    }
    return romanNum;
};
/**
 * Remove a given value from the array
 * @param arr The array
 * @param val The value to be removed
 */
export const removeFromArray = (arr, val) => {
    let i = arr.indexOf(val);
    if (i != -1)
        arr.splice(i, 1);
    return arr;
};
//#endregion
//#region Random
/** Randomize an array and return it (does not modify the input array) */
export const randomize = (inArr) => {
    let outArr = [];
    let numLoops = inArr.length;
    let indices = [];
    for (let i = 0; i < numLoops; i++) {
        indices[i] = i;
    }
    for (let i = 0; i < numLoops; i++) {
        let index = indices[Math.floor(random(indices.length))];
        outArr[i] = inArr[index];
        indices = removeFromArray(indices, index);
    }
    return outArr;
};
/** Return a random value between the maximum and minimum value */
export const random = (...minMaxIn) => {
    let minMax = minAndMax(minMaxIn, 0, 1);
    return (Math.random() * (minMax[1] - minMax[0])) + minMax[0];
};
/** Generate and return a random color */
export const randomColor = () => {
    let r = Math.floor(random(255));
    let g = Math.floor(random(255));
    let b = Math.floor(random(255));
    return new Color(r, g, b);
};
//#endregion
//#endregion
