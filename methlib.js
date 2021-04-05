System.register("methlib", [], function (exports_1, context_1) {
    "use strict";
    var minAndMax, cbCheck, posAndSize, timeForm, padArr, ImageFromSrc, typeCheck, propertyCheck, Set, Color, Cell, Piece, FullPiece, Vector2, Vector3, LineInf2D, LineInf3D, LineSegment2D, LineSegment3D, CRange, Box, Cube, Collider2, Collider3, Button, Card, Deck, EllipseMode, RectMode, ColorMode, Canvas, E, PI, PHI, pieces, romChars, romVals, maxVal, MRV, IntersectionBetween, isPrime, areCoprime, isLimited, logb, gcd, lcm, modPow, eTot, carmichael, extendedEuclid, findCoprimesLessThan, findCoprimeList, limit, RSAEncrypt, RSADecrypt, MLA_Citation, prettyTime, romanNumerals, removeFromArray, randomize, random, randomColor;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            minAndMax = (minMax, defMin, defMax) => {
                let min = minMax.length > 1 ? minMax[0] : defMin;
                let max = minMax.length > 1 ? minMax[1] : minMax.length > 0 ? minMax[0] : defMax;
                return [min, max];
            };
            cbCheck = (cb, cond, ...params) => {
                if (cb !== undefined)
                    if (cond)
                        cb(params);
            };
            posAndSize = (obj, a, b, c, d) => {
                if (a !== undefined) {
                    if (Box.IsBox(a)) {
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
            timeForm = (val, measurement) => val.toString() + measurement + (val > 1 ? "s" : "");
            exports_1("padArr", padArr = (inArr, targetLen, padStr) => {
                let padWith = padStr === undefined ? ["0"] : Array.from(padStr);
                for (let i = inArr.length; i < targetLen; i += padWith.length) {
                    inArr.unshift(...padWith);
                }
                for (let i = inArr.length; i > targetLen; i--) {
                    inArr.shift();
                }
                return inArr;
            });
            exports_1("ImageFromSrc", ImageFromSrc = (src) => {
                let tempImg = new Image();
                tempImg.src = src;
                return tempImg;
            });
            exports_1("typeCheck", typeCheck = (objToCheck, ...props) => {
                let isType = true;
                for (let prop of props)
                    if (!propertyCheck(objToCheck, prop))
                        isType = false;
                return isType;
            });
            exports_1("propertyCheck", propertyCheck = (objToCheck, prop) => objToCheck[prop] !== undefined);
            Set = class Set {
                constructor(arr) {
                    this.union = (otherSet) => Set.union(this, otherSet);
                    this.intersection = (otherSet) => Set.intersection(this, otherSet);
                    this.setDiff = (otherSet) => Set.setDiff(this, otherSet);
                    this.cartesianProduct = (otherSet) => Set.cartesianProduct(this, otherSet);
                    this.powerSet = () => Set.powerSet(this);
                    this.symDiff = (otherSet) => Set.symDiff(otherSet, this);
                    this.elems = arr !== undefined ? Set.getElemsIfSet(arr) : [];
                }
            };
            exports_1("Set", Set);
            Set.IsSet = (obj) => typeCheck(obj, "elems");
            Set.createSetIfNot = (arr) => Set.IsSet(arr) ? arr : { elems: arr };
            Set.getElemsIfSet = (arr) => Set.IsSet(arr) ? arr.elems : arr;
            Set.loopThroughElems = (inSet, func) => {
                let arr = Set.getElemsIfSet(inSet);
                for (let i of arr) {
                    func(i);
                }
            };
            Set.addGenSetToGenSet = (arrA, arrB) => {
                Set.loopThroughElems(arrB, (elem) => {
                    Set.addToGenSet(arrA, elem);
                });
            };
            Set.addToGenSet = (arr, elem) => {
                Set.IsSet(arr) ? arr.elems.push(elem) : arr.push(elem);
            };
            Set.removeDuplicateItemsFromGenSet = (arr) => {
                let outArr = [];
                Set.loopThroughElems(arr, (elem) => {
                    if (!Set.elemIsInSet(elem, outArr)) {
                        Set.addToGenSet(elem, outArr);
                    }
                });
                return new Set(outArr);
            };
            Set.elemIsInSet = (setIn, elem) => {
                let elems = Set.createSetIfNot(setIn).elems;
                return elems.indexOf(elem) != -1;
            };
            Set.makeGenSetDense = (setIn) => new Set(Set.getElemsIfSet(setIn)
                .filter(elem => elem != null));
            Set.union = (a, b) => {
                let outArr = [];
                Set.addGenSetToGenSet(outArr, a);
                Set.addGenSetToGenSet(outArr, b);
                return Set.removeDuplicateItemsFromGenSet(outArr);
            };
            Set.intersection = (a, b) => {
                let outArr = [];
                Set.loopThroughElems(a, (elem) => {
                    if (Set.elemIsInSet(elem, b)) {
                        Set.addToGenSet(elem, outArr);
                    }
                });
                return new Set(outArr);
            };
            Set.setDiff = (a, b) => {
                let outArr = [];
                Set.loopThroughElems(a, (elem) => {
                    if (!Set.elemIsInSet(elem, b)) {
                        Set.addToGenSet(elem, outArr);
                    }
                });
                return new Set(outArr);
            };
            Set.cartesianProduct = (a, b) => {
                let outArr = [];
                Set.loopThroughElems(a, (elemA) => {
                    Set.loopThroughElems(b, (elemB) => {
                        Set.addToGenSet(outArr, [elemA, elemB]);
                    });
                });
                return new Set(outArr);
            };
            Set.powerSet = (a) => {
                let aSet = Set.getElemsIfSet(a);
                let outArr = [];
                for (let index = 0; index < 2 ** aSet.length; index++) {
                    let binaryString = index.toString(2);
                    let binaryArr = binaryString.split("");
                    binaryArr = padArr(binaryArr, aSet.length);
                    let elemArr = [];
                    binaryArr.forEach((e, i) => {
                        if (e == "1")
                            Set.addToGenSet(elemArr, aSet[i]);
                    });
                    Set.addToGenSet(outArr, elemArr);
                }
                return new Set(outArr);
            };
            Set.symDiff = (a, b) => Set.setDiff(Set.union(a, b), Set.intersection(a, b));
            Color = class Color {
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
                            this.a = params.length == 1 ? 255 : params[1];
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
                            this.a = params.length % 2 == 1 ? 255 : params.length == 2 ? params[1] : params[3];
                        }
                    }
                }
            };
            exports_1("Color", Color);
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
            Color.Black = new Color(0, 0, 0, 255);
            Color.Grey = new Color(128, 128, 128, 255);
            Color.Gray = new Color(128, 128, 128, 255);
            Color.White = new Color(255, 255, 255, 255);
            Color.Red = new Color(255, 0, 0, 255);
            Color.Green = new Color(0, 255, 0, 255);
            Color.Blue = new Color(0, 0, 255, 255);
            Color.Yellow = new Color(255, 255, 0, 255);
            Color.Purple = new Color(255, 0, 255, 255);
            Color.Cyan = new Color(0, 255, 255, 255);
            Color.Orange = new Color(255, 128, 0, 255);
            Cell = class Cell {
                constructor(isOn = false, color = new Color(), prevColor = new Color()) {
                    this.on = isOn;
                    this.color = color;
                    this.prevColor = prevColor;
                }
            };
            exports_1("Cell", Cell);
            Piece = class Piece {
                constructor(parts) {
                    if (Vector2.IsVector2(parts[0])) {
                        this.parts = parts;
                    }
                    else {
                        this.parts = parts.map(part => new Vector2(...part));
                    }
                }
            };
            exports_1("Piece", Piece);
            Piece.LinePieceA = new Piece([[0, 2], [1, 2], [2, 2], [3, 2]]);
            Piece.LinePieceB = new Piece([[2, 0], [2, 1], [2, 2], [2, 3]]);
            Piece.LinePieceC = new Piece([[0, 2], [1, 2], [2, 2], [3, 2]]);
            Piece.LinePieceD = new Piece([[1, 0], [1, 1], [1, 2], [1, 3]]);
            Piece.LPieceAA = new Piece([[2, 1], [0, 2], [1, 2], [2, 2]]);
            Piece.LPieceAB = new Piece([[1, 1], [1, 2], [1, 3], [2, 3]]);
            Piece.LPieceAC = new Piece([[0, 2], [1, 2], [2, 2], [0, 3]]);
            Piece.LPieceAD = new Piece([[0, 1], [1, 1], [1, 2], [1, 3]]);
            Piece.LPieceBA = new Piece([[0, 1], [0, 2], [1, 2], [2, 2]]);
            Piece.LPieceBB = new Piece([[1, 1], [2, 1], [1, 2], [1, 3]]);
            Piece.LPieceBC = new Piece([[0, 2], [1, 2], [2, 2], [2, 3]]);
            Piece.LPieceBD = new Piece([[2, 1], [2, 2], [1, 3], [2, 3]]);
            Piece.SquarePieceA = new Piece([[1, 1], [2, 1], [1, 2], [2, 2]]);
            Piece.ZPieceAA = new Piece([[1, 1], [2, 1], [0, 2], [1, 2]]);
            Piece.ZPieceAB = new Piece([[1, 1], [1, 2], [2, 2], [2, 3]]);
            Piece.ZPieceAC = new Piece([[1, 2], [2, 2], [0, 3], [1, 3]]);
            Piece.ZPieceAD = new Piece([[0, 1], [0, 2], [1, 2], [1, 3]]);
            Piece.ZPieceBA = new Piece([[0, 1], [1, 1], [1, 2], [2, 2]]);
            Piece.ZPieceBB = new Piece([[2, 1], [1, 2], [2, 2], [1, 3]]);
            Piece.ZPieceBC = new Piece([[0, 2], [1, 2], [1, 3], [2, 3]]);
            Piece.ZPieceBD = new Piece([[1, 1], [0, 2], [1, 2], [0, 3]]);
            Piece.TPieceA = new Piece([[1, 1], [0, 2], [1, 2], [2, 2]]);
            Piece.TPieceB = new Piece([[1, 1], [1, 2], [2, 2], [1, 3]]);
            Piece.TPieceC = new Piece([[0, 2], [1, 2], [2, 2], [1, 3]]);
            Piece.TPieceD = new Piece([[1, 1], [0, 2], [1, 2], [1, 3]]);
            FullPiece = class FullPiece {
                constructor(pieceRots, color) {
                    this.rotations = pieceRots;
                    this.color = color;
                }
            };
            exports_1("FullPiece", FullPiece);
            FullPiece.LinePiece = new FullPiece([Piece.LinePieceA, Piece.LinePieceB, Piece.LinePieceC, Piece.LinePieceD], Color.Cyan);
            FullPiece.LPieceA = new FullPiece([Piece.LPieceAA, Piece.LPieceAB, Piece.LPieceAC, Piece.LPieceAD], Color.Orange);
            FullPiece.LPieceB = new FullPiece([Piece.LPieceBA, Piece.LPieceBB, Piece.LPieceBC, Piece.LPieceBD], Color.Blue);
            FullPiece.SquarePiece = new FullPiece([Piece.SquarePieceA, Piece.SquarePieceA, Piece.SquarePieceA, Piece.SquarePieceA], Color.Yellow);
            FullPiece.ZPieceA = new FullPiece([Piece.ZPieceAA, Piece.ZPieceAB, Piece.ZPieceAC, Piece.ZPieceAD], Color.Green);
            FullPiece.ZPieceB = new FullPiece([Piece.ZPieceBA, Piece.ZPieceBB, Piece.ZPieceBC, Piece.ZPieceBD], Color.Red);
            FullPiece.TPiece = new FullPiece([Piece.TPieceA, Piece.TPieceB, Piece.TPieceC, Piece.TPieceD], Color.Purple);
            Vector2 = class Vector2 {
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
            };
            exports_1("Vector2", Vector2);
            Vector2.IsVector2 = (obj) => typeCheck(obj, "x", "y");
            Vector2.copy = (vec) => new Vector2(vec);
            Vector2.add = (a, b) => new Vector2(a.x + b.x, a.y + b.y);
            Vector2.sub = (a, b) => new Vector2(a.x - b.x, a.y - b.y);
            Vector2.scale = (vec, scalar) => new Vector2(vec.x * scalar, vec.y * scalar);
            Vector2.addBoth = (vec, addend) => new Vector2(vec.x + addend, vec.y + addend);
            Vector2.setBoth = (vec, val) => {
                let tempVec = Vector2.copy(vec);
                tempVec.x = val;
                tempVec.y = val;
                return tempVec;
            };
            Vector2.normalize = (vec) => Vector2.scale(vec, 1 / Vector2.len(vec));
            Vector2.limit = (limitee, ...minMaxIn) => {
                let minMax = minAndMax(minMaxIn, new Vector2(-1, -1), new Vector2(1, 1));
                return new Vector2(limit(limitee.x, minMax[0].x, minMax[1].x), limit(limitee.y, minMax[0].y, minMax[1].y));
            };
            Vector2.heading = (vec) => {
                let a = Math.atan2(vec.x, vec.y);
                a = a < 0 ? Math.PI * 2 + a : a;
                return a;
            };
            Vector2.squareLength = (vec) => Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
            Vector2.len = (vec) => Math.sqrt(Vector2.squareLength(vec));
            Vector2.distSquared = (a, b) => Vector2.squareLength(Vector2.sub(a, b));
            Vector2.dist = (a, b) => Math.sqrt(Vector2.distSquared(a, b));
            Vector2.fromAngle = (angle) => new Vector2(Math.sin(angle), Math.cos(angle));
            Vector3 = class Vector3 {
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
                            if (y !== undefined) {
                                if (Vector2.IsVector2(y)) {
                                    this.y = y.x;
                                    this.z = y.y;
                                }
                            }
                        }
                    }
                }
            };
            exports_1("Vector3", Vector3);
            Vector3.IsVector3 = (obj) => typeCheck(obj, "x", "y", "z");
            Vector3.copy = (vec) => new Vector3(vec);
            Vector3.add = (a, b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
            Vector3.sub = (a, b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
            Vector3.scale = (vec, scalar) => new Vector3(vec.x * scalar, vec.y * scalar, vec.z * scalar);
            Vector3.addAll = (vec, addend) => new Vector3(vec.x + addend, vec.y + addend, vec.z + addend);
            Vector3.setAll = (val) => new Vector3(val, val, val);
            Vector3.normalize = (vec) => Vector3.scale(vec, 1 / Vector3.len(vec));
            Vector3.limit = (limitee, ...minMaxIn) => {
                let minMax = minAndMax(minMaxIn, new Vector3(-1, -1, -1), new Vector3(1, 1, 1));
                return new Vector3(limit(limitee.x, minMax[0].x, minMax[1].x), limit(limitee.y, minMax[0].y, minMax[1].y), limit(limitee.z, minMax[0].z, minMax[1].z));
            };
            Vector3.heading = (vec) => {
                let XYVec = new Vector2(vec.x, vec.y);
                let Phi = XYVec.heading();
                let PhiZVec = new Vector2(vec.z, XYVec.len());
                let Theta = PhiZVec.heading();
                return [Phi, Theta];
            };
            Vector3.squareLength = (vec) => Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
            Vector3.len = (vec) => Math.sqrt(Vector3.squareLength(vec));
            Vector3.distSquared = (a, b) => Vector3.squareLength(Vector3.sub(a, b));
            Vector3.dist = (a, b) => Math.sqrt(Vector3.distSquared(a, b));
            Vector3.fromAngle = (phi, theta) => {
                let XYVec = Vector2.fromAngle(phi);
                let PhiZVec = Vector2.fromAngle(theta);
                return new Vector3(XYVec, PhiZVec.x);
            };
            LineInf2D = class LineInf2D {
                constructor(source, angleOrDest) {
                    this.source = source;
                    this.angle = Vector2.IsVector2(angleOrDest) ? Vector2.heading(Vector2.sub(angleOrDest, source)) : angleOrDest;
                }
            };
            exports_1("LineInf2D", LineInf2D);
            LineInf3D = class LineInf3D {
                constructor(source, dest) {
                    this.source = source;
                    let angles = Vector3.sub(dest, source).heading();
                    this.angle = angles[0];
                    this.theta = angles[1];
                }
            };
            exports_1("LineInf3D", LineInf3D);
            LineSegment2D = class LineSegment2D {
                constructor(a, b) {
                    this.a = a;
                    this.b = b;
                }
            };
            exports_1("LineSegment2D", LineSegment2D);
            LineSegment3D = class LineSegment3D {
                constructor(a, b) {
                    this.a = a;
                    this.b = b;
                }
            };
            exports_1("LineSegment3D", LineSegment3D);
            CRange = class CRange {
                constructor(start, size) {
                    this.start = start;
                    this.size = size;
                }
            };
            exports_1("CRange", CRange);
            Box = class Box {
                constructor(a, b, c, d) {
                    this.getCenter = () => Box.getCenter(this);
                    this.render = (context) => {
                        context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
                    };
                    posAndSize(this, a, b, c, d);
                }
            };
            exports_1("Box", Box);
            Box.IsBox = (obj) => typeCheck(obj, "pos", "size");
            Box.getCenter = (box) => Vector2.add(box.pos, Vector2.scale(box.size, 1 / 2));
            Cube = class Cube {
                constructor(pos, size) {
                    this.getCenter = () => Cube.getCenter(this);
                    this.pos = new Vector3(pos);
                    this.size = new Vector3(size);
                }
            };
            exports_1("Cube", Cube);
            Cube.IsCube = (obj) => typeCheck(obj, "pos", "size");
            Cube.getCenter = (cube) => Vector3.add(cube.pos, Vector3.scale(cube.size, 1 / 2));
            Collider2 = class Collider2 extends Box {
                constructor(a, b, c, d) {
                    super(a, b, c, d);
                    this.checkCollision = (colliders, uCB, dCB, lCB, rCB, aCB) => {
                        let nextPosX = Vector2.add(this.pos, { x: this.vel.x, y: 0 });
                        let nextPosY = Vector2.add(this.pos, { x: 0, y: this.vel.y });
                        let nextColX = new Collider2(nextPosX, this.size);
                        let nextColY = new Collider2(nextPosY, this.size);
                        let uHit = false, dHit = false, lHit = false, rHit = false;
                        for (let col of colliders) {
                            if (col == this)
                                continue;
                            if (IntersectionBetween.BoxAndBox(col, nextColY)) {
                                if (this.vel.y > 0)
                                    uHit = true;
                                else
                                    dHit = true;
                            }
                            if (IntersectionBetween.BoxAndBox(col, nextColX)) {
                                if (this.vel.x > 0)
                                    lHit = true;
                                else
                                    rHit = true;
                            }
                            cbCheck(uCB, uHit, col);
                            cbCheck(dCB, dHit, col);
                            cbCheck(lCB, lHit, col);
                            cbCheck(rCB, rHit, col);
                            cbCheck(aCB, uHit || dHit || lHit || rHit, col);
                        }
                    };
                    this.wallLimit = (bounds, gCB, wCB) => {
                        let wH = false;
                        let gH = false;
                        if (isLimited(this.pos.x, bounds.x - this.size.x)) {
                            this.vel.x = 0;
                            wH = true;
                        }
                        if (isLimited(this.pos.y, bounds.y - this.size.y)) {
                            this.vel.y = 0;
                            gH = true;
                        }
                        cbCheck(wCB, wH);
                        cbCheck(gCB, gH);
                        this.pos.limit(Vector2.sub(bounds, this.size));
                    };
                    this.subUpdate = (updates) => {
                        this.pos.add(Vector2.scale(this.vel, 1 / (updates ? updates : 1)));
                    };
                    this.update = () => { this.vel.add(this.acc); };
                    this.vel = new Vector2();
                    this.acc = new Vector2();
                }
            };
            exports_1("Collider2", Collider2);
            Collider2.IsCollider2 = (obj) => Box.IsBox(obj) && typeCheck(obj, "vel", "acc");
            Collider3 = class Collider3 extends Cube {
                constructor(pos, size) {
                    super(pos, size);
                    this.checkCollision = (colliders, xposCB, xnegCB, yposCB, ynegCB, zposCB, znegCB, aCB) => {
                        let nextPosX = Vector3.add(this.pos, { x: this.vel.x, y: 0, z: 0 });
                        let nextPosY = Vector3.add(this.pos, { x: 0, y: this.vel.y, z: 0 });
                        let nextPosZ = Vector3.add(this.pos, { x: 0, y: 0, z: this.vel.z });
                        let nextColX = new Collider3(nextPosX, this.size);
                        let nextColY = new Collider3(nextPosY, this.size);
                        let nextColZ = new Collider3(nextPosZ, this.size);
                        let xposHit = false;
                        let xnegHit = false;
                        let yposHit = false;
                        let ynegHit = false;
                        let zposHit = false;
                        let znegHit = false;
                        for (let col of colliders) {
                            if (col == this)
                                continue;
                            if (IntersectionBetween.CubeAndCube(col, nextColX)) {
                                if (this.vel.x > 0)
                                    xposHit = true;
                                else
                                    xnegHit = true;
                            }
                            if (IntersectionBetween.CubeAndCube(col, nextColY)) {
                                if (this.vel.y > 0)
                                    yposHit = true;
                                else
                                    ynegHit = true;
                            }
                            if (IntersectionBetween.CubeAndCube(col, nextColZ)) {
                                if (this.vel.z > 0)
                                    zposHit = true;
                                else
                                    znegHit = true;
                            }
                            cbCheck(xposCB, xposHit, col);
                            cbCheck(xnegCB, xnegHit, col);
                            cbCheck(yposCB, yposHit, col);
                            cbCheck(ynegCB, ynegHit, col);
                            cbCheck(zposCB, zposHit, col);
                            cbCheck(znegCB, znegHit, col);
                            cbCheck(aCB, xposHit || xnegHit || yposHit || ynegHit || zposHit || znegHit, col);
                        }
                    };
                    this.wallLimit = (bounds, gCB, wCB) => {
                        let wH = false;
                        let gH = false;
                        if (isLimited(this.pos.x, bounds.x - this.size.x)) {
                            this.vel.x = 0;
                            wH = true;
                        }
                        if (isLimited(this.pos.y, bounds.y - this.size.y)) {
                            this.vel.y = 0;
                            wH = true;
                        }
                        if (isLimited(this.pos.z, bounds.z - this.size.z)) {
                            this.vel.z = 0;
                            gH = true;
                        }
                        cbCheck(wCB, wH);
                        cbCheck(gCB, gH);
                        this.pos.limit(Vector3.sub(bounds, this.size));
                    };
                    this.subUpdate = (updates) => {
                        this.pos.add(Vector3.scale(this.vel, 1 / (updates ? updates : 1)));
                    };
                    this.update = () => { this.vel.add(this.acc); };
                    this.vel = new Vector3();
                    this.acc = new Vector3();
                }
            };
            exports_1("Collider3", Collider3);
            Collider3.IsCollider3 = (obj) => Box.IsBox(obj) && typeCheck(obj, "vel", "acc");
            Button = class Button extends Box {
                constructor(onClick, a = 0, b = 0, c = 0, d = 0) {
                    super(a, b, c, d);
                    this.wasClicked = (clickPos) => IntersectionBetween.Point2DAndBox(clickPos, this);
                    this.onClick = onClick;
                }
            };
            exports_1("Button", Button);
            Button.IsButton = (obj) => Box.IsBox(obj) && typeCheck(obj, "onClick");
            Card = class Card {
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
                    this.sprite.src = "https://javakid0826.github.io/Methlib-js/Images/" + this.suit + this.num + ".png";
                }
            };
            exports_1("Card", Card);
            Card.IsCard = (obj) => typeCheck(obj, "numI", "suitI", "num", "suit", "name", "flipped", "sprite");
            Card.SUITS = ['C', 'S', 'H', 'D'];
            Card.CARDVALS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            Card.cardBack = ImageFromSrc("https://javakid0826.github.io/Methlib-js/Images/Back.png");
            Card.cardHighlight = ImageFromSrc("https://javakid0826.github.io/Methlib-js/Images/Highlight.png");
            Card.cardOutline = ImageFromSrc("https://javakid0826.github.io/Methlib-js/Images/Outline.png");
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
            Deck = class Deck {
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
            };
            exports_1("Deck", Deck);
            Deck.IsDeck = (obj) => typeCheck(obj, "cards");
            Deck.shuffle = (deck) => {
                let temp = new Deck();
                temp.cards = randomize(deck.cards);
                return temp;
            };
            (function (EllipseMode) {
                EllipseMode[EllipseMode["CENTER"] = 0] = "CENTER";
                EllipseMode[EllipseMode["CORNER"] = 1] = "CORNER";
            })(EllipseMode || (EllipseMode = {}));
            exports_1("EllipseMode", EllipseMode);
            (function (RectMode) {
                RectMode[RectMode["CENTER"] = 0] = "CENTER";
                RectMode[RectMode["CORNER"] = 1] = "CORNER";
            })(RectMode || (RectMode = {}));
            exports_1("RectMode", RectMode);
            (function (ColorMode) {
                ColorMode[ColorMode["RGB"] = 0] = "RGB";
                ColorMode[ColorMode["HSV"] = 1] = "HSV";
            })(ColorMode || (ColorMode = {}));
            exports_1("ColorMode", ColorMode);
            Canvas = class Canvas {
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
            };
            exports_1("Canvas", Canvas);
            exports_1("E", E = 2.7182818);
            exports_1("PI", PI = 3.1415926);
            exports_1("PHI", PHI = 1.6180339);
            exports_1("pieces", pieces = [FullPiece.LinePiece, FullPiece.LPieceA, FullPiece.LPieceB, FullPiece.SquarePiece, FullPiece.ZPieceA, FullPiece.ZPieceB, FullPiece.TPiece]);
            romChars = ['I', 'V', 'X', 'L', 'D', 'C', 'M', 'v', 'x', 'l', 'd', 'c', 'm'];
            romVals = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
            maxVal = romVals[romVals.length - 1] * 3;
            for (let i = 0; i < romVals.length / 2; i++) {
                maxVal += romVals[i * 2 + 1];
            }
            MRV = maxVal;
            IntersectionBetween = class IntersectionBetween {
            };
            exports_1("IntersectionBetween", IntersectionBetween);
            IntersectionBetween.Point1DAndRange = (point, range) => point > range.start && point < range.start + range.size;
            IntersectionBetween.RangeAndRange = (a, b) => (a.start + a.size >= b.start) && (b.start + b.size >= a.start);
            IntersectionBetween.Point2DAndPoint2D = (pointA, pointB) => pointA.x == pointB.x && pointA.y == pointB.y;
            IntersectionBetween.Point2DAndPoint3D = (pointA, pointB) => IntersectionBetween.Point2DAndPoint2D(pointA, pointB) && pointB.z == 0;
            IntersectionBetween.Point2DAndLineInf2D = (point, line) => {
                let pointToSourceVec = Vector2.sub(line.source, point);
                return line.angle == pointToSourceVec.heading();
            };
            IntersectionBetween.Point2DAndLineSegment2D = (point, line) => {
                let pointToAVec = Vector2.sub(line.a, point);
                let AToBVec = Vector2.sub(line.b, line.a);
                return AToBVec.heading() == pointToAVec.heading() && pointToAVec.squareLength() < AToBVec.squareLength();
            };
            IntersectionBetween.Point2DAndBox = (point, box) => {
                let xRange = new CRange(box.pos.x, box.size.x);
                let yRange = new CRange(box.pos.y, box.size.y);
                return IntersectionBetween.Point1DAndRange(point.x, xRange) && IntersectionBetween.Point1DAndRange(point.y, yRange);
            };
            IntersectionBetween.LineInf2DAndBox = (line, box) => {
                let boxCorners = [
                    box.pos,
                    Vector2.add(box.pos, { x: box.size.x, y: 0 }),
                    Vector2.add(box.pos, { x: 0, y: box.size.y }),
                    Vector2.add(box.pos, box.size)
                ];
                let pointToCornerLines = boxCorners.map(corner => new LineInf2D(line.source, corner));
                let pointToCornerAngles = pointToCornerLines.map(PTCL => PTCL.angle);
                let angleA = Math.max(...pointToCornerAngles);
                let angleB = Math.min(...pointToCornerAngles);
                return line.angle < angleA && line.angle > angleB;
            };
            IntersectionBetween.LineInf2DAndCube = (line, cube) => {
                let boxCorners = [
                    cube.pos,
                    Vector2.add(cube.pos, { x: cube.size.x, y: 0 }),
                    Vector2.add(cube.pos, { x: 0, y: cube.size.y }),
                    Vector2.add(cube.pos, cube.size)
                ];
                let pointToCornerLines = boxCorners.map(corner => new LineInf2D(line.source, corner));
                let pointToCornerAngles = pointToCornerLines.map(PTCL => PTCL.angle);
                let angleA = Math.max(...pointToCornerAngles);
                let angleB = Math.min(...pointToCornerAngles);
                return line.angle < angleA && line.angle > angleB;
            };
            IntersectionBetween.BoxAndBox = (a, b) => {
                let xa = new CRange(a.pos.x, a.size.x);
                let xb = new CRange(b.pos.x, b.size.x);
                let ya = new CRange(a.pos.y, a.size.y);
                let yb = new CRange(b.pos.y, b.size.y);
                return (IntersectionBetween.RangeAndRange(xa, xb) && IntersectionBetween.RangeAndRange(ya, yb));
            };
            IntersectionBetween.CubeAndCube = (a, b) => {
                let xya = new Box(new Vector2(a.pos.x, a.pos.y), new Vector2(a.size.x, a.size.y));
                let xyb = new Box(new Vector2(b.pos.x, b.pos.y), new Vector2(b.size.x, b.size.y));
                let xza = new Box(new Vector2(a.pos.x, a.pos.z), new Vector2(a.size.x, a.size.z));
                let xzb = new Box(new Vector2(b.pos.x, b.pos.z), new Vector2(b.size.x, b.size.z));
                let yza = new Box(new Vector2(a.pos.y, a.pos.z), new Vector2(a.size.y, a.size.z));
                let yzb = new Box(new Vector2(b.pos.y, b.pos.z), new Vector2(b.size.y, b.size.z));
                return (IntersectionBetween.BoxAndBox(xya, xyb) && IntersectionBetween.BoxAndBox(xza, xzb) && IntersectionBetween.BoxAndBox(yza, yzb));
            };
            exports_1("isPrime", isPrime = (val) => {
                for (let i = 2; i < Math.sqrt(val); i++) {
                    if (isPrime(i)) {
                        if (gcd(i, val) != 1) {
                            return false;
                        }
                    }
                }
                return true;
            });
            exports_1("areCoprime", areCoprime = (a, b) => gcd(a, b) == 1);
            exports_1("isLimited", isLimited = (limitee, ...minMaxIn) => {
                let minMax = minAndMax(minMaxIn, 0, 1);
                return (limitee <= minMax[0] || limitee >= minMax[1]);
            });
            exports_1("logb", logb = (val, base) => Math.log(val) / Math.log(base));
            exports_1("gcd", gcd = (a, b) => {
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
            });
            exports_1("lcm", lcm = (a, b) => (a * b) / gcd(a, b));
            exports_1("modPow", modPow = (b, e, m) => {
                let modPow = 1;
                for (let i = 0; i < e; i++) {
                    modPow *= b;
                    modPow %= m;
                }
                return modPow;
            });
            exports_1("eTot", eTot = (val) => {
                let numCoprimes = 0;
                for (let i = 0; i < val; i++) {
                    if (gcd(i, val) == 1) {
                        numCoprimes++;
                    }
                }
                return numCoprimes;
            });
            exports_1("carmichael", carmichael = (val) => {
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
            });
            exports_1("extendedEuclid", extendedEuclid = (a, b) => {
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
            });
            exports_1("findCoprimesLessThan", findCoprimesLessThan = (n) => {
                let coprimes = [];
                for (let i = 0; i < n; i++) {
                    if (areCoprime(i, n)) {
                        coprimes.push(i);
                    }
                }
                return coprimes;
            });
            exports_1("findCoprimeList", findCoprimeList = (n, len) => {
                let coprimes = [];
                let checkNum = 1;
                while (coprimes.length < len) {
                    if (areCoprime(checkNum, n)) {
                        coprimes.push(checkNum);
                    }
                    checkNum++;
                }
                return coprimes;
            });
            exports_1("limit", limit = (limitee, ...minMaxIn) => {
                let minMax = minAndMax(minMaxIn, 0, 1);
                if (limitee <= minMax[0])
                    return minMax[0];
                if (limitee >= minMax[1])
                    return minMax[1];
                return limitee;
            });
            exports_1("RSAEncrypt", RSAEncrypt = (message, n, k) => {
                let BEM = [];
                let CA = message.split("");
                for (let i in CA) {
                    let NC = parseInt(CA[i]);
                    BEM[i] = modPow(NC, k, n);
                }
                return BEM;
            });
            exports_1("RSADecrypt", RSADecrypt = (ENCMess, n, j) => {
                let message = "";
                for (let i of ENCMess) {
                    let NC = modPow(i, j, n);
                    message += NC.toString();
                }
                return message;
            });
            exports_1("MLA_Citation", MLA_Citation = (quote, act, scene, lineStart, lineEnd) => {
                let modQuote;
                if (lineEnd - lineStart < 2) {
                    modQuote = quote;
                }
                else {
                    let quoteWords = quote.split(" ");
                    modQuote = quoteWords[0] + " " + quoteWords[1] + " ... " + quoteWords[quoteWords.length - 2] + " " + quoteWords[quoteWords.length - 1];
                }
                return "'" + modQuote + "' (" + romanNumerals(act) + ", " + scene + ", " + lineStart + "-" + lineEnd + ")";
            });
            exports_1("prettyTime", prettyTime = (time) => {
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
            });
            exports_1("romanNumerals", romanNumerals = (val) => {
                let romanNum = "";
                let tenthPower = Math.ceil(logb(val, 10)) + 1;
                if (val > MRV)
                    throw "Number too large";
                for (let i = tenthPower; i > 0; i--) {
                    let workingString = "";
                    let operatingNum = Math.floor(val / Math.pow(10, i - 1));
                    operatingNum -= Math.floor(val / Math.pow(10, i)) * 10;
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
            });
            exports_1("removeFromArray", removeFromArray = (arr, val) => {
                let i = arr.indexOf(val);
                if (i != -1)
                    arr.splice(i, 1);
                return arr;
            });
            exports_1("randomize", randomize = (inArr) => {
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
            });
            exports_1("random", random = (...minMaxIn) => {
                let minMax = minAndMax(minMaxIn, 0, 1);
                return (Math.random() * (minMax[1] - minMax[0])) + minMax[0];
            });
            exports_1("randomColor", randomColor = () => {
                let r = Math.floor(random(255));
                let g = Math.floor(random(255));
                let b = Math.floor(random(255));
                return new Color(r, g, b);
            });
        }
    };
});
