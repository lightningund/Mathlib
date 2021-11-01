/**
 * Checks if a given object is of a given type
 * @param objToCheck The object you want to check is of type
 * @param props The properties of the object you want to check against
 * @returns whether the object is of specified type
 */
 export const typeCheck = <T>(objToCheck: any, ...props: Array<keyof T>): objToCheck is T => {
	for (let prop of props)
		try {
			if (!propertyCheck(objToCheck, prop))
				return false;
		} catch {
			return false;
		}
	return true;
}

export const propertyCheck = <T>(objToCheck: any, prop: keyof T): objToCheck is T => prop in (objToCheck as T);

//#region Classes
//#region Set
export interface ISet {
	elems: any[];
}

export type genSet = any[] | ISet;

/**
 * Set (for set theory stuff)
 * @class
 */
export class CSet implements ISet {
	static readonly IsSet = (obj: any): obj is ISet => typeCheck<ISet>(obj, "elems");

	elems: any[];

	constructor(arr?: genSet) {
		this.elems = arr !== undefined ? CSet.getElemsIfSet(arr) : [];
	}

	private static readonly createSetIfNot = (arr: genSet): ISet => CSet.IsSet(arr) ? arr : { elems: arr as any[] };
	private static readonly getElemsIfSet = (arr: genSet): any[] => CSet.IsSet(arr) ? arr.elems : arr;

	private static readonly loopThroughElems = (
		inSet: genSet,
		func: (
			elem: any
		) => void
	): void => {
		CSet.getElemsIfSet(inSet).forEach(i => func(i));
	}

	private static readonly addGenSetToGenSet = (
		base: genSet,
		toAdd: genSet
	): void => {
		CSet.loopThroughElems(toAdd, (elem: any) => {
			CSet.addToGenSet(base, elem);
		});
	}

	private static readonly addToGenSet = (
		arr: genSet,
		elem: any
	): void => {
		CSet.IsSet(arr) ? arr.elems.push(elem) : arr.push(elem);
	}

	private static readonly removeDuplicateItemsFromGenSet = (arr: genSet): CSet => {
		let outArr: genSet = [];
		CSet.loopThroughElems(arr, (elem: any): void => {
			if (!CSet.elemIsInSet(elem, outArr)) {
				CSet.addToGenSet(elem, outArr);
			}
		});
		return new CSet(outArr);
	}

	private static readonly elemIsInSet = (setIn: genSet, elem: any): boolean => {
		let elems: any[] = CSet.createSetIfNot(setIn).elems;
		return elems.indexOf(elem) !== -1;
	}

	static readonly makeGenSetDense = (setIn: genSet): CSet =>
		new CSet(CSet.getElemsIfSet(setIn).filter(elem => elem !== null));

	static readonly union = (a: genSet, b: genSet): CSet => {
		const outArr: genSet = [];
		CSet.addGenSetToGenSet(outArr, a);
		CSet.addGenSetToGenSet(outArr, b);
		return CSet.removeDuplicateItemsFromGenSet(outArr);
	}
	readonly union = (otherSet: genSet): CSet => CSet.union(this, otherSet);

	static readonly intersection = (a: genSet, b: genSet): CSet => {
		let outArr: genSet = [];
		CSet.loopThroughElems(a, (elem: any): void => {
			if (CSet.elemIsInSet(elem, b)) {
				CSet.addToGenSet(elem, outArr);
			}
		});
		return new CSet(outArr);
	}
	readonly intersection = (otherSet: genSet): CSet => CSet.intersection(this, otherSet);

	static readonly setDiff = (a: genSet, b: genSet): CSet => {
		let outArr: genSet = [];
		CSet.loopThroughElems(a, (elem: any): void => {
			if (!CSet.elemIsInSet(elem, b)) {
				CSet.addToGenSet(elem, outArr);
			}
		});
		return new CSet(outArr);
	}
	readonly setDiff = (otherSet: genSet): CSet => CSet.setDiff(this, otherSet);

	static readonly cartesianProduct = (a: genSet, b: genSet): CSet => {
		let outArr: genSet = [];
		CSet.loopThroughElems(a, (elemA: any): void => {
			CSet.loopThroughElems(b, (elemB: any): void => {
				CSet.addToGenSet(outArr, [elemA, elemB]);
			});
		});
		return new CSet(outArr);
	}
	readonly cartesianProduct = (otherSet: genSet): CSet => CSet.cartesianProduct(this, otherSet);

	static readonly powerSet = (a: genSet): CSet => {
		let aSet: any[] = CSet.getElemsIfSet(a);

		let outArr: genSet = [];

		for (let index = 0; index < 2 ** aSet.length; index++) {
			let binaryString: string = index.toString(2);
			let binaryArr: string[] = binaryString.split("");
			binaryArr = padArr(binaryArr, aSet.length);

			let elemArr: any[] = [];
			binaryArr.forEach((e: string, i: number) => {
				if (e == "1") CSet.addToGenSet(elemArr, aSet[i]);
			})
			CSet.addToGenSet(outArr, elemArr)
		}

		return new CSet(outArr);
	}
	readonly powerSet = (): CSet => CSet.powerSet(this);

	static readonly symDiff = (a: genSet, b: genSet): CSet => CSet.setDiff(CSet.union(a, b), CSet.intersection(a, b));
	readonly symDiff = (otherSet: genSet): CSet => CSet.symDiff(otherSet, this);
}
//#endregion

//#region Color
/**
 * Interface representing a color in the RGB style
 * @interface
 * @property {number} r - Red
 * @property {number} g - Green
 * @property {number} b - Blue
 * @property {number} [a] - Alpha/Transparency
 */
export interface RGBColor {
	/** @property Red */
	r: number;
	/** @property Green */
	g: number;
	/** @property Blue */
	b: number;
	/** @property Alpha/Transparency */
	a?: number;
}

/**
 * Interface representing a color in the HSV style
 * @interface
 * @property {number} h - Hue
 * @property {number} s - Saturation
 * @property {number} v - Value/Brightness
 * @property {number} [a] - Alpha/Transparency
 */
export interface HSVColor {
	/** @property Hue */
	h: number;
	/** @property Saturation */
	s: number;
	/** @property Value/Brightness */
	v: number;
	/** @property Alpha/Transparency */
	a?: number;
}

/**
 * General Color Type
 * @type
 * @extends RGBColor
 * @extends HSVColor
 */
export type TColor = RGBColor | HSVColor;

/**
 * @class
 * @classdesc Color Class
 * @extends RGBColor
 * @extends HSVColor
 */
export class Color implements RGBColor, HSVColor {
	static readonly IsRGBColor = (obj: any): obj is RGBColor => typeCheck<RGBColor>(obj, "r", "g", "b");
	static readonly IsHSVColor = (obj: any): obj is HSVColor => typeCheck<HSVColor>(obj, "h", "s", "v");
	static readonly IsColor = (obj: any): obj is TColor => Color.IsHSVColor(obj) || Color.IsRGBColor(obj);

	r: number;
	g: number;
	b: number;
	a: number;
	h: number;
	s: number;
	v: number;

	constructor(...params: any[]) {
		let r = params[0];

		if (Color.IsRGBColor(r)) {
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;
			if (typeof r.a !== undefined) {
				this.a = r.a;
			} else {
				this.a = params.length === 1 ? 255 : params[1];
			}
		} else {
			if (params.length == 0) {
				this.r = 0;
				this.g = 0;
				this.b = 0;
				this.a = 255;
			} else {
				this.r = params[0];
				this.g = params.length <= 2 ? params[0] : params[1];
				this.b = params.length <= 2 ? params[0] : params[2];
				this.a = params.length % 2 === 1 ? 255 : params.length == 2 ? params[1] : params[3];
			}
		}
	}

	static readonly getRGBHex = (color: TColor): string => {
		if (Color.IsHSVColor(color)) return Color.getRGBHex(Color.HSVToRGB(color));
		return "#" + Color.hexOfColors(color.r, color.g, color.b).join("");
	};
	readonly getRGBHex = (): string => Color.getRGBHex(this);

	static readonly getRGBAHex = (color: TColor): string => {
		if (Color.IsHSVColor(color)) return Color.getRGBAHex(Color.HSVToRGB(color));
		return Color.getRGBHex(color) + Color.hexOfColor(color.a, "ff");
	}
	readonly getRGBAHex = (): string => Color.getRGBAHex(this);

	static readonly getRGBFunc = (color: TColor): string => {
		if (Color.IsHSVColor(color)) return Color.getRGBFunc(Color.HSVToRGB(color));
		return "rgb(" + Color.limitColors(color.r, color.g, color.b).join(", ") + ")";
	}
	readonly getRGBFunc = (): string => Color.getRGBFunc(this);

	static readonly getRGBAFunc = (color: TColor): string => {
		if (Color.IsHSVColor(color)) return Color.getRGBAFunc(Color.HSVToRGB(color));
		return "rgba(" + Color.limitColors(color.r, color.g, color.b, color.a).join(", ") + ")";
	}
	readonly getRGBAFunc = (): string => Color.getRGBAFunc(this);

	static readonly hexOfColors = (...colors: number[]): string[] => {
		return colors.map(color => Color.hexOfColor(color))
	}

	static readonly limitColors = (...colors: number[]): number[] => {
		return colors.map(color => Color.limitColor(color))
	}

	static readonly hexOfColor = (val?: number, def?: string) => val ? (Color.limitColor(val) < 16 ? "0" : "") + val.toString(16) : def ? def : "00";

	static readonly limitColor = (val?: number) => val ? limit(val, 0, 256) : 0;

	static readonly RGBtoHSV = (colorIn: RGBColor): HSVColor => {
		let Cmax = Math.max(colorIn.r, colorIn.g, colorIn.b);
		let Cmin = Math.min(colorIn.r, colorIn.g, colorIn.b);
		let delta = Cmax - Cmin;
		let a = colorIn.a;

		let H = 60 * (
			delta == 0 ? 0 :
				Cmax == colorIn.r ? ((colorIn.g - colorIn.b) / delta) % 6 :
					Cmax == colorIn.g ? ((colorIn.b - colorIn.r) / delta) + 4 :
						((colorIn.r - colorIn.g) / delta) + 2
		);

		let S = Cmax == 0 ? 0 : delta / Cmax;

		return {
			h: H,
			s: S,
			v: Cmax,
			a: (a === undefined ? 255 : a)
		};
	}

	/**
	 * Convert a color in HSV format to RGB format
	 */
	static readonly HSVToRGB = (colorIn: HSVColor): RGBColor => {
		let h = colorIn.h;
		let s = colorIn.s;
		let v = colorIn.v;
		let a = colorIn.a;

		let i = Math.floor(h * 6);
		let f = h * 6 - i;
		let p = v * (1 - s);
		let q = v * (1 - f * s);
		let t = v * (1 - (1 - f) * s);

		let r: number, g: number, b: number;

		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}

		r *= 256;
		g *= 256;
		b *= 256;

		return {
			r, g, b,
			a: (a === undefined ? 255 : a)
		};
	}

	/** @constant @default 0x000000FF */
	static readonly Black: Color = new Color(0, 0, 0, 255);
	/** @constant @default 0x808080FF */
	static readonly Grey: Color = new Color(128, 128, 128, 255);
	/** @constant @default 0x808080FF */
	static readonly Gray: Color = new Color(128, 128, 128, 255);
	/** @constant @default 0xFFFFFFFF */
	static readonly White: Color = new Color(255, 255, 255, 255);
	/** @constant @default 0xFF0000FF */
	static readonly Red: Color = new Color(255, 0, 0, 255);
	/** @constant @default 0x00FF00FF */
	static readonly Green: Color = new Color(0, 255, 0, 255);
	/** @constant @default 0x0000FFFF */
	static readonly Blue: Color = new Color(0, 0, 255, 255);
	/** @constant @default 0xFFFF00FF */
	static readonly Yellow: Color = new Color(255, 255, 0, 255);
	/** @constant @default 0xFF00FFFF */
	static readonly Purple: Color = new Color(255, 0, 255, 255);
	/** @constant @default 0x00FFFFFF */
	static readonly Cyan: Color = new Color(0, 255, 255, 255);
	/** @constant @default 0xFF8000FF */
	static readonly Orange: Color = new Color(255, 128, 0, 255);
}
//#endregion

//#region Vector
//#region Vector2
interface IVector2 {
	x: number;
	y: number;
}

/** @typedef TVecto2 */
export type TVector2 = IVector2;

/**
 * Helper class for 2D vectors
 * @class
 */
export class Vector2 implements IVector2 {
	static readonly IsVector2 = (obj: any): obj is TVector2 => typeCheck<TVector2>(obj, "x", "y");

	x: number;
	y: number;

	constructor(x?: number | TVector2, y?: number) {
		if (x !== undefined) {
			if (Vector2.IsVector2(x)) {
				this.x = x.x;
				this.y = x.y;
			} else {
				this.x = x;
				this.y = y !== undefined ? y : x;
			}
		} else {
			this.x = 0;
			this.y = 0;
		}
	}

	/**
	 * Take a vector and create a new Vector2 from it
	 */
	static readonly copy = (vec: TVector2): Vector2 => new Vector2(vec);
	readonly copy = (): Vector2 => new Vector2(this);

	/**
	 * Add two vectors
	 */
	static readonly add = (a: TVector2, b: TVector2): Vector2 => new Vector2(a.x + b.x, a.y + b.y);
	readonly add = (addend: TVector2): Vector2 => {
		let n: TVector2 = Vector2.add(this, addend);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	/**
	 * Subtract two vectors
	 */
	static readonly sub = (a: TVector2, b: TVector2): Vector2 => new Vector2(a.x - b.x, a.y - b.y);
	readonly sub = (subtrahend: TVector2): Vector2 => {
		let n: TVector2 = Vector2.sub(this, subtrahend);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	/**
	 * Scale a vector by a set value
	 */
	static readonly scale = (vec: TVector2, scalar: number): Vector2 => new Vector2(vec.x * scalar, vec.y * scalar);
	readonly scale = (scalar: number): Vector2 => {
		let n: TVector2 = Vector2.scale(this, scalar);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	/**
	 * Add a flat value to both values of the vector
	 */
	static readonly addBoth = (vec: TVector2, addend: number): Vector2 => new Vector2(vec.x + addend, vec.y + addend);
	readonly addBoth = (addend: number): Vector2 => {
		let n: TVector2 = Vector2.addBoth(this, addend);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	static readonly setBoth = (vec: TVector2, val: number): Vector2 => {
		let tempVec: Vector2 = Vector2.copy(vec);
		tempVec.x = val;
		tempVec.y = val;
		return tempVec;
	}
	readonly setBoth = (val: number): Vector2 => {
		let n: TVector2 = Vector2.setBoth(this, val);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	static readonly rotate = (vec: TVector2, angle: number): Vector2 => new Vector2(
		vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
		vec.x * Math.sin(angle) + vec.y * Math.cos(angle)
	);
	readonly rotate = (angle: number): Vector2 => {
		let n: TVector2 = Vector2.rotate(this, angle);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	/**
	 * Normalize a vector (scale it so it's length is 1)
	 */
	static readonly normalize = (vec: TVector2): TVector2 => Vector2.scale(vec, 1 / Vector2.len(vec));
	readonly normalize = (): TVector2 => {
		let n: TVector2 = Vector2.normalize(this);
		this.x = n.x;
		this.y = n.y;
		return this;
	};

	/**
	 * Limit a vector to a rectangle defined by the lower and upper limits forming the corners
	 */
	static readonly limit = (limitee: TVector2, ...minMaxIn: IVector2[]): Vector2 => {
		let minMax = minAndMax(minMaxIn, new Vector2(-1, -1), new Vector2(1, 1));

		return new Vector2(
			limit(limitee.x, minMax[0].x, minMax[1].x),
			limit(limitee.y, minMax[0].y, minMax[1].y)
		);
	}
	readonly limit = (...minMaxIn: TVector2[]): Vector2 => {
		let n: TVector2 = Vector2.limit(this, ...minMaxIn);
		this.x = n.x;
		this.y = n.y;
		return this;
	}

	/**
	 * Find the angle of a vector
	 */
	static readonly heading = (vec: TVector2): number => {
		let a: number = Math.atan2(vec.x, vec.y);
		a = a < 0 ? Math.PI * 2 + a : a;
		return a;
	}
	readonly heading = (): number => Vector2.heading(this);

	/**
	 * Find the length of a vector but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly squareLength = (vec: TVector2): number => Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
	readonly squareLength = (): number => Vector2.squareLength(this);

	/**
	 * Find the length of a vector
	 */
	static readonly len = (vec: TVector2): number => Math.sqrt(Vector2.squareLength(vec));
	readonly len = (): number => Vector2.len(this);

	/**
	 * Find the Distance between two vectors but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly distSquared = (a: TVector2, b: TVector2): number => Vector2.squareLength(Vector2.sub(a, b));
	readonly distSquared = (a: TVector2): number => Vector2.distSquared(a, this);

	/**
	 * Find the Distance between two vectors
	 */
	static readonly dist = (a: TVector2, b: TVector2): number => Math.sqrt(Vector2.distSquared(a, b));
	readonly dist = (a: TVector2): number => Vector2.dist(a, this);

	static readonly fromAngle = (angle: number): Vector2 => new Vector2(Math.sin(angle), Math.cos(angle));
}
//#endregion

//#region Vector3
interface IVector3 {
	x: number;
	y: number;
	z: number;
}

/** @typedef TVector3 */
export type TVector3 = IVector3;

/**
 * Helper class for 3D vectors
 * @class
 */
export class Vector3 implements IVector3 {
	static readonly IsVector3 = (obj: any): obj is TVector3 => typeCheck<TVector3>(obj, "x", "y", "z");

	x: number;
	y: number;
	z: number;

	constructor();
	constructor(xyz: TVector3);
	constructor(xy: TVector2, z: number);
	constructor(x: number, yz: TVector2);
	constructor(x: number, y: number, z: number);
	constructor(x?: number | TVector2 | TVector3, y?: number | TVector2, z?: number) {
		this.x = 0;
		this.y = 0;
		this.z = z !== undefined ? z : 0;

		if (x !== undefined) {
			if (Vector3.IsVector3(x)) {
				this.x = x.x;
				this.y = x.y;
				this.z = x.z;
			} else if (Vector2.IsVector2(x)) {
				this.x = x.x;
				this.y = x.y;
			} else {
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

	/**
	 * Take a vector and create a new Vector3 from it
	 */
	static readonly copy = (vec: TVector3): Vector3 => new Vector3(vec);
	readonly copy = (): Vector3 => new Vector3(this);

	/**
	 * Add two vectors
	 */
	static readonly add = (a: TVector3, b: TVector3): Vector3 => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
	readonly add = (addend: TVector3): Vector3 => {
		let n: TVector3 = Vector3.add(this, addend);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	/**
	 * Subtract two vectors
	 */
	static readonly sub = (a: TVector3, b: TVector3): Vector3 => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
	readonly sub = (subtrahend: TVector3): Vector3 => {
		let n: TVector3 = Vector3.sub(this, subtrahend);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	/**
	 * Scale a vector by a set value
	 */
	static readonly scale = (vec: TVector3, scalar: number): Vector3 => new Vector3(vec.x * scalar, vec.y * scalar, vec.z * scalar);
	readonly scale = (scalar: number): Vector3 => {
		let n: TVector3 = Vector3.scale(this, scalar);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	/**
	 * Add a flat value to both values of the vector
	 */
	static readonly addAll = (vec: TVector3, addend: number): Vector3 => new Vector3(vec.x + addend, vec.y + addend, vec.z + addend);
	readonly addAll = (addend: number): Vector3 => {
		let n: TVector3 = Vector3.addAll(this, addend);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	static readonly setAll = (val: number): Vector3 => new Vector3(val, val, val);
	readonly setAll = (val: number): Vector3 => {
		this.x = val;
		this.y = val;
		this.z = val;
		return this;
	}

	private static readonly makeRotationMatrix = (rx: number, ry: number, rz: number): number[][] => [
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

	static readonly rotate = (vec: TVector3, rx: number, ry: number, rz: number): Vector3 => {
		let arr: number[][] = Vector3.makeRotationMatrix(rx, ry, rz);
		return new Vector3(
			vec.x * arr[0][0] + vec.y * arr[0][1] + vec.z * arr[0][2],
			vec.x * arr[1][0] + vec.y * arr[1][1] + vec.z * arr[1][2],
			vec.x * arr[2][0] + vec.y * arr[2][1] + vec.z * arr[2][2]
		);
	};
	readonly rotate = (rx: number, ry: number, rz: number) => {
		let n: TVector3 = Vector3.rotate(this, rx, ry, rz);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	private static readonly makeRotationMatrixAroundAxis = (axis: TVector3, angle: number): number[][] => [
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
	static readonly rotateAround = (vec: TVector3, axis: TVector3, angle: number): Vector3 => {
		let arr: number[][] = Vector3.makeRotationMatrixAroundAxis(axis, angle);
		return new Vector3(
			vec.x * arr[0][0] + vec.y * arr[0][1] + vec.z * arr[0][2],
			vec.x * arr[1][0] + vec.y * arr[1][1] + vec.z * arr[1][2],
			vec.x * arr[2][0] + vec.y * arr[2][1] + vec.z * arr[2][2]
		);
	}
	readonly rotateAround = (axis: TVector3, angle: number): Vector3 => {
		let n: TVector3 = Vector3.rotateAround(this, axis, angle);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	/**
	 * Normalize a vector (scale it so it's length is 1)
	 */
	static readonly normalize = (vec: TVector3): TVector3 => Vector3.scale(vec, 1 / Vector3.len(vec));
	readonly normalize = (): TVector3 => {
		let n: TVector3 = Vector3.normalize(this);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	};

	/**
	 * Limit a vector to a cube defined by the lower and upper limits forming the corners
	 */
	static readonly limit = (limitee: TVector3, ...minMaxIn: TVector3[]): Vector3 => {
		let minMax = minAndMax(minMaxIn, new Vector3(-1, -1, -1), new Vector3(1, 1, 1));

		return new Vector3(
			limit(limitee.x, minMax[0].x, minMax[1].x),
			limit(limitee.y, minMax[0].y, minMax[1].y),
			limit(limitee.z, minMax[0].z, minMax[1].z)
		);
	}
	readonly limit = (...minMaxIn: TVector3[]): Vector3 => {
		let n: TVector3 = Vector3.limit(this, ...minMaxIn);
		this.x = n.x;
		this.y = n.y;
		this.z = n.z;
		return this;
	}

	/**
	 * Find the angle of a vector using spherical coordinates
	 * @returns [phi, theta]
	 */
	static readonly heading = (vec: TVector3): number[] => {
		let XYVec: Vector2 = new Vector2(vec.x, vec.y);
		let Phi: number = XYVec.heading();
		let PhiZVec: Vector2 = new Vector2(vec.z, XYVec.len());
		let Theta: number = PhiZVec.heading();
		return [Phi, Theta];
	}
	readonly heading = (): number[] => Vector3.heading(this);

	/**
	 * Find the length of a vector but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly squareLength = (vec: TVector3): number => Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
	readonly squareLength = (): number => Vector3.squareLength(this);

	/**
	 * Find the length of a vector
	 */
	static readonly len = (vec: TVector3): number => Math.sqrt(Vector3.squareLength(vec));
	readonly len = (): number => Vector3.len(this);

	/**
	 * Find the Distance between two vectors but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly distSquared = (a: TVector3, b: TVector3): number => Vector3.squareLength(Vector3.sub(a, b));
	readonly distSquared = (a: TVector3): number => Vector3.distSquared(a, this);

	/**
	 * Find the Distance between two vectors
	 */
	static readonly dist = (a: TVector3, b: TVector3): number => Math.sqrt(Vector3.distSquared(a, b));
	readonly dist = (a: TVector3): number => Vector3.dist(a, this);

	static readonly fromAngle = (phi: number, theta: number): Vector3 => {
		let XYVec: Vector2 = Vector2.fromAngle(phi);
		let PhiZVec: Vector2 = Vector2.fromAngle(theta);
		return new Vector3(XYVec, PhiZVec.x);
	}
}
//#endregion

//#region VectorN
interface IVectorN {
	coords: number[];
}

/** @typedef TVectorN */
export type TVectorN = IVectorN;

/**
 * Helper class for N-Dim vectors
 * @class
 */
export class VectorN implements IVectorN {
	static readonly IsVectorN = (obj: any): obj is TVectorN => typeCheck<TVectorN>(obj, "coords");

	coords: number[];

	constructor();
	constructor(baseVec: TVector2);
	constructor(baseVec: TVector3);
	constructor(baseVec: TVectorN);
	constructor(coords: number[]);
	constructor(base?: TVector2 | TVector3 | TVectorN | number[]) {
		this.coords = [];

		if (base !== undefined) {
			if (Vector2.IsVector2(base)) {
				this.coords[0] = base.x;
				this.coords[1] = base.y;
			} else if (Vector3.IsVector3(base)) {
				this.coords[0] = base.x;
				this.coords[1] = base.y;
				this.coords[2] = base.z;
			} else if (VectorN.IsVectorN(base)){
				this.coords = base.coords.slice(0, base.coords.length);
			} else {
				this.coords = base.slice(0, base.length);
			}
		}
	}

	/**
	 * Take a vector and create a new VectorN from it
	 */
	static readonly copy = (vec: TVectorN): VectorN => new VectorN(vec);
	readonly copy = (): VectorN => new VectorN(this);

	/**
	 * Add two vectors
	 */
	static readonly add = (a: TVectorN, b: TVectorN): VectorN => new VectorN(a.coords.map((elem, ind) => elem + b.coords[ind]));
	readonly add = (addend: TVectorN): VectorN => {
		let n: TVectorN = VectorN.add(this, addend);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	}

	/**
	 * Subtract two vectors
	 */
	static readonly sub = (a: TVectorN, b: TVectorN): VectorN => new VectorN(a.coords.map((elem, ind) => elem - b.coords[ind]));
	readonly sub = (subtrahend: TVectorN): VectorN => {
		let n: TVectorN = VectorN.sub(this, subtrahend);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	}

	/**
	 * Scale a vector by a set value
	 */
	static readonly scale = (vec: TVectorN, scalar: number): VectorN => new VectorN(vec.coords.map(elem => elem * scalar));
	readonly scale = (scalar: number): VectorN => {
		let n: TVectorN = VectorN.scale(this, scalar);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	}

	/**
	 * Add a flat value to both values of the vector
	 */
	static readonly addAll = (vec: TVectorN, addend: number): VectorN => new VectorN(vec.coords.map(elem => elem + addend));
	readonly addAll = (addend: number): VectorN => {
		let n: TVectorN = VectorN.addAll(this, addend);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	}

	static readonly setAll = (vec: TVectorN, val: number): VectorN => new VectorN(vec.coords.map(_elem => val));
	readonly setAll = (val: number): VectorN => {
		this.coords = this.coords.map(_elem => val);
		return this;
	}

	/**
	 * Normalize a vector (scale it so it's length is 1)
	 */
	static readonly normalize = (vec: TVectorN): TVectorN => VectorN.scale(vec, 1 / VectorN.len(vec));
	readonly normalize = (): TVectorN => {
		let n: TVectorN = VectorN.normalize(this);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	};

	/**
	 * Limit a vector to a cube defined by the lower and upper limits forming the corners
	 */
	static readonly limit = (limitee: TVectorN, ...minMaxIn: TVectorN[]): VectorN => {
		let minMax = minAndMax(minMaxIn, VectorN.setAll(limitee, -1), VectorN.setAll(limitee, 1));

		return new VectorN(limitee.coords.map((elem, ind) => limit(elem, minMax[0][ind], minMax[1][ind])));
	}
	readonly limit = (...minMaxIn: TVectorN[]): VectorN => {
		let n: TVectorN = VectorN.limit(this, ...minMaxIn);
		this.coords = n.coords.slice(0, n.coords.length);
		return this;
	}

	/**
	 * Find the length of a vector but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly squareLength = (vec: TVectorN): number => {
		let sum: number = 0;
		vec.coords.forEach(elem => sum+= Math.pow(elem, 2));
		return sum;
	};
	readonly squareLength = (): number => VectorN.squareLength(this);

	/**
	 * Find the length of a vector
	 */
	static readonly len = (vec: TVectorN): number => Math.sqrt(VectorN.squareLength(vec));
	readonly len = (): number => VectorN.len(this);

	/**
	 * Find the Distance between two vectors but squared
	 * (saves on resources because Math.sqrt is pretty expensive computationally)
	 */
	static readonly distSquared = (a: TVectorN, b: TVectorN): number => VectorN.squareLength(VectorN.sub(a, b));
	readonly distSquared = (a: TVectorN): number => VectorN.distSquared(a, this);

	/**
	 * Find the Distance between two vectors
	 */
	static readonly dist = (a: TVectorN, b: TVectorN): number => Math.sqrt(VectorN.distSquared(a, b));
	readonly dist = (a: TVectorN): number => VectorN.dist(a, this);
}
//#endregion
//#endregion

//#region Lines
//#region InfLines
//#region Line2
interface ILineInf2D {
	source: TVector2;
	angle: number;
}

export type TLineInf2D = ILineInf2D;

export class LineInf2D implements ILineInf2D {
	source: TVector2;
	angle: number;

	/**
	 * @constructor
	 * @param source The source point
	 * @param angleOrDest Either the angle or another point on the line
	 */
	constructor(source: TVector2, angleOrDest: number | TVector2) {
		this.source = source;
		this.angle = Vector2.IsVector2(angleOrDest) ? Vector2.heading(Vector2.sub(angleOrDest as TVector2, source)) : angleOrDest as number;
	}
}
//#endregion
//#region Line3
interface ILineInf3D {
	source: TVector3;
	angle: number;
	theta: number;
}

export type TLineInf3D = ILineInf3D;

export class LineInf3D implements ILineInf3D {
	source: TVector3;
	angle: number;
	theta: number;

	/**
	 * @constructor
	 * @param source The source point
	 * @param dest Another reference point on the line
	 */
	constructor(source: TVector3, dest: TVector3) {
		this.source = source;
		let angles: number[] = Vector3.sub(dest, source).heading();
		this.angle = angles[0];
		this.theta = angles[1];
	}
}
//#endregion
//#endregion
//#region LineSegments
//#region LineSegment2
interface ILineSegment2D {
	a: TVector2;
	b: TVector2;
}

export type TLineSegment2D = ILineSegment2D;

export class LineSegment2D implements ILineSegment2D {
	a: TVector2;
	b: TVector2;

	constructor(a: TVector2, b: TVector2) {
		this.a = a;
		this.b = b;
	}
}
//#endregion
//#region LineSegment3
interface ILineSegment3D {
	a: TVector3;
	b: TVector3;
}

export type TLineSegment3D = ILineSegment3D;

export class LineSegment3D implements ILineSegment3D {
	a: TVector3;
	b: TVector3;

	constructor(a: TVector3, b: TVector3) {
		this.a = a;
		this.b = b;
	}
}
//#endregion
//#endregion
//#endregion

//#region Range
export interface IRange {
	start: number;
	size: number;
}

export type TRange = IRange;

export class CRange implements IRange {
	start: number;
	size: number;

	constructor(start: number, size: number) {
		this.start = start;
		this.size = size;
	}
}
//#endregion

//#region Box
export interface IBox {
	pos: Vector2;
	size: Vector2;
}

export type TBox = IBox;

/**
 * General 2d rectangle
 * @class
 */
export class Box implements IBox {
	static readonly IsBox = (obj: any): obj is TBox => typeCheck<TBox>(obj, "pos", "size");

	pos: Vector2;
	size: Vector2;

	//#region Construcors
	/**
	 * Create a general Box with default position and default size
	 * @constructor
	 */
	constructor();
	/**
	 * Create a Box from a position Vector and default size
	 * @constructor
	 * @param pos TVector2 representing the position
	 */
	constructor(pos: TVector2);
	/**
	 * Create a Box from a position Vector and default size
	 * @constructor
	 * @param posX number representing the x coordinate of the Box
	 * @param posY number representing the y coordinate of the Box
	 */
	constructor(posX: number, posY: number);
	/**
	 * Create a Box from another TBox object
	 * @constructor
	 * @param box The TBox used as a reference
	 */
	constructor(box: TBox);
	/**
	 * Create a Box from a position Vector and a size Vector
	 * @constructor
	 * @param pos TVector2 representing the position
	 * @param size TVector2 representing the width and height
	 */
	constructor(pos: TVector2, size: TVector2);
	/**
	 * Create a Box from a position Vector and explicit width and height values
	 * @constructor
	 * @param pos TVector2 representing the position
	 * @param width number representing the width of the Box
	 * @param height number representing the height of the Box
	 */
	constructor(pos: TVector2, width: number, height: number);
	/**
	 * Create a Box from a explicit x and y values and a size Vector
	 * @constructor
	 * @param posX number representing the x coordinate of the Box
	 * @param posY number representing the y coordinate of the Box
	 * @param size TVector2 representing the width and height
	 */
	constructor(posX: number, posY: number, size: TVector2);
	/**
	 * Create a Box from a explicit x and y values and explicit width and height values
	 * @constructor
	 * @param posX number representing the x coordinate of the Box
	 * @param posY number representing the y coordinate of the Box
	 * @param width number representing the width of the Box
	 * @param height number representing the height of the Box
	 */
	constructor(posX: number, posY: number, width: number, height: number);
	//#endregion
	constructor(
		a?: any,
		b?: any,
		c?: any,
		d?: any
	) {
		posAndSize(this, a, b, c, d);
	}

	static readonly getCenter = (box: IBox): TVector2 => Vector2.add(box.pos, Vector2.scale(box.size, 1 / 2));
	readonly getCenter = (): TVector2 => Box.getCenter(this);

	readonly render = (context: Canvas): void => {
		context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}
}
//#endregion

//#region Cube
export interface ICube {
	pos: Vector3;
	size: Vector3;
}

export type TCube = ICube;

/**
 * General 3d cuboid
 * @class
 */
export class Cube implements ICube {
	static readonly IsCube = (obj: any): obj is TCube => typeCheck<TCube>(obj, "pos", "size");

	pos: Vector3;
	size: Vector3;

	constructor(pos: TVector3, size: TVector3) {
		this.pos = new Vector3(pos);
		this.size = new Vector3(size);
	}

	static readonly getCenter = (cube: TCube): TVector3 => Vector3.add(cube.pos, Vector3.scale(cube.size, 1 / 2));
	readonly getCenter = (): TVector3 => Cube.getCenter(this);
}
//#endregion

//#region NCube
export interface INCube {
	pos: VectorN;
	size: VectorN;
}

export type TNCube = INCube;

/**
 * General 3d cuboid
 * @class
 */
export class NCube implements INCube {
	static readonly IsNCube = (obj: any): obj is TNCube => typeCheck<TNCube>(obj, "pos", "size");

	pos: VectorN;
	size: VectorN;

	constructor(pos: TVectorN, size: TVectorN) {
		this.pos = new VectorN(pos);
		this.size = new VectorN(size);
	}

	static readonly getCenter = (cube: TNCube): TVectorN => VectorN.add(cube.pos, VectorN.scale(cube.size, 1 / 2));
	readonly getCenter = (): TVectorN => NCube.getCenter(this);
}
//#endregion

//#region R O U N D

//#region Circle
export interface ICircle {
	center: Vector2;
	radius: number;
}

export type TCircle = ICircle;

export class Circle implements ICircle {
	static readonly IsCircle = (obj: any): obj is TCircle => typeCheck<TCircle>(obj, "center", "radius");
	center: Vector2;
	radius: number;

	constructor(centerPos: TVector2, rad: number) {
		this.center = new Vector2(centerPos);
		this.radius = rad;
	}
}
//#endregion

//#region Sphere
export interface ISphere {
	center: Vector3;
	radius: number;
}

export type TSphere = ISphere;

export class Sphere implements ISphere {
	static readonly IsSphere = (obj: any): obj is TSphere => typeCheck<TSphere>(obj, "center", "radius");
	center: Vector3;
	radius: number;

	constructor(centerPos: TVector3, rad: number) {
		this.center = new Vector3(centerPos);
		this.radius = rad;
	}
}
//#endregion

//#region NSphere
export interface INSphere {
	center: VectorN;
	radius: number;
}

export type TNSphere = INSphere;

export class NSphere implements INSphere {
	static readonly IsNSphere = (obj: any): obj is TNSphere => typeCheck<TNSphere>(obj, "center", "radius");
	center: VectorN;
	radius: number;

	constructor(centerPos: TVectorN, rad: number) {
		this.center = new VectorN(centerPos);
		this.radius = rad;
	}
}
//#endregion

//#endregion

//#region Collider
//#region Collider2
export interface ICollider2 extends IBox {
	vel: Vector2;
	acc: Vector2;
}

export type TCollider2 = ICollider2;

/**
 * Helper class for a rectangular 2D collider
 * @class
 */
export class Collider2 extends Box implements ICollider2 {
	static readonly IsCollider2 = (obj: any): obj is TCollider2 => Box.IsBox(obj) && typeCheck<TCollider2>(obj, "vel", "acc");

	vel: Vector2;
	acc: Vector2;
	//#region Constructors
	/**
	 * Create a general Collider with default position and default size
	 * @constructor
	 */
	constructor();
	/**
	 * Create a Collider from a position Vector and default size
	 * @constructor
	 * @param pos TVector2 representing the position
	 */
	constructor(pos: TVector2);
	/**
	 * Create a Collider from a position Vector and default size
	 * @constructor
	 * @param posX number representing the x coordinate of the Collider
	 * @param posY number representing the y coordinate of the Collider
	 */
	constructor(posX: number, posY: number);
	/**
	 * Create a Collider from another TBox object
	 * @constructor
	 * @param box The TBox used as a reference
	 */
	constructor(box: TBox);
	/**
	 * Create a Collider from a position Vector and a size Vector
	 * @constructor
	 * @param pos TVector2 representing the position
	 * @param size TVector2 representing the width and height
	 */
	constructor(pos: TVector2, size: TVector2);
	/**
	 * Create a Collider from a position Vector and explicit width and height values
	 * @constructor
	 * @param pos TVector2 representing the position
	 * @param width number representing the width of the Collider
	 * @param height number representing the height of the Collider
	 */
	constructor(pos: TVector2, width: number, height: number);
	/**
	 * Create a Collider from a explicit x and y values and a size Vector
	 * @constructor
	 * @param posX number representing the x coordinate of the Collider
	 * @param posY number representing the y coordinate of the Collider
	 * @param size TVector2 representing the width and height
	 */
	constructor(posX: number, posY: number, size: TVector2);
	/**
	 * Create a Collider from a explicit x and y values and explicit width and height values
	 * @constructor
	 * @param posX number representing the x coordinate of the Collider
	 * @param posY number representing the y coordinate of the Collider
	 * @param width number representing the width of the Collider
	 * @param height number representing the height of the Collider
	 */
	constructor(posX: number, posY: number, width: number, height: number);
	//#endregion
	constructor(
		a?: any,
		b?: any,
		c?: any,
		d?: any
	) {
		super(a, b, c, d);

		this.vel = new Vector2();
		this.acc = new Vector2();
	}

	readonly checkCollision = (
		colliders: TCollider2[],
		callbacks: {
			yneg?: (a: TCollider2) => any,
			ypos?: (a: TCollider2) => any,
			yany?: (a: TCollider2) => any,
			xneg?: (a: TCollider2) => any,
			xpos?: (a: TCollider2) => any,
			xany?: (a: TCollider2) => any,
			any?: (a: TCollider2) => any
		},
	): void => {
		const nextPosX = Vector2.add(this.pos, { x: this.vel.x, y: 0 });
		const nextPosY = Vector2.add(this.pos, { x: 0, y: this.vel.y });

		const nextColX = new Collider2(nextPosX, this.size);
		const nextColY = new Collider2(nextPosY, this.size);

		let hit: boolean = false;

		for (let col of colliders) {
			if (col === this) continue;
			if (IntersectionBetween.BoxAndBox(col, nextColY)) {
				if (this.vel.y > 0) cbCheck(callbacks.ypos, true, col);
				else cbCheck(callbacks.yneg, true, col);
				cbCheck(callbacks.yany, true, col);
				hit = true;
			}
			if (IntersectionBetween.BoxAndBox(col, nextColX)) {
				if (this.vel.x > 0) cbCheck(callbacks.xpos, true, col);
				else cbCheck(callbacks.xneg, true, col);
				cbCheck(callbacks.xany, true, col);
				hit = true;
			}

			cbCheck(callbacks.any, hit, col);
			if(hit) return;
		}
	}

	readonly wallLimit = (
		bounds: TVector2,
		callbacks: {
			x?: () => any,
			y?: () => any
		}
	): void => {
		if (isLimited(this.pos.x, bounds.x - this.size.x)) {
			this.vel.x = 0;
			cbCheck(callbacks.x, true);
		}
		if (isLimited(this.pos.y, bounds.y - this.size.y)) {
			this.vel.y = 0;
			cbCheck(callbacks.y, true);
		}
		this.pos.limit(Vector2.sub(bounds, this.size));
	}

	readonly subUpdate = (updates?: number): void => {
		this.pos.add(
			Vector2.scale(this.vel, 1 / (updates ? updates : 1))
		);
	}

	readonly update = (): void => { this.vel.add(this.acc); }
}
//#endregion

//#region Collider3
export interface ICollider3 extends ICube {
	vel: Vector3;
	acc: Vector3;
}

export type TCollider3 = ICollider3;

/**
 * Helper class for a cuboid 3D collider
 * @class
 */
export class Collider3 extends Cube implements ICollider3 {
	static readonly IsCollider3 = (obj: any): obj is TCollider3 => Box.IsBox(obj) && typeCheck<TCollider3>(obj, "vel", "acc");

	vel: Vector3;
	acc: Vector3;

	constructor(pos: TVector3, size: TVector3) {
		super(pos, size);

		this.vel = new Vector3();
		this.acc = new Vector3();
	}

	readonly checkCollision = (
		colliders: TCollider3[],
		callbacks?: {
			xpos?: (a: TCollider3) => any,
			xneg?: (a: TCollider3) => any,
			ypos?: (a: TCollider3) => any,
			yneg?: (a: TCollider3) => any,
			zpos?: (a: TCollider3) => any,
			zneg?: (a: TCollider3) => any,
			general?: (a: TCollider3) => any
		}
	): void => {
		let nextPosX = Vector3.add(this.pos, { x: this.vel.x, y: 0, z: 0 });
		let nextPosY = Vector3.add(this.pos, { x: 0, y: this.vel.y, z: 0 });
		let nextPosZ = Vector3.add(this.pos, { x: 0, y: 0, z: this.vel.z });

		let nextColX = new Collider3(nextPosX, this.size);
		let nextColY = new Collider3(nextPosY, this.size);
		let nextColZ = new Collider3(nextPosZ, this.size);

		let hit: boolean = false;

		for (let col of colliders) {
			if (col == this) continue;
			if (IntersectionBetween.CubeAndCube(col, nextColX)) {
				if (this.vel.x > 0) cbCheck(callbacks.xpos, true, col);
				else cbCheck(callbacks.xneg, true, col);
				hit = true;
			}
			if (IntersectionBetween.CubeAndCube(col, nextColY)) {
				if (this.vel.y > 0) cbCheck(callbacks.ypos, true, col);
				else cbCheck(callbacks.yneg, true, col);
				hit = true;
			}
			if (IntersectionBetween.CubeAndCube(col, nextColZ)) {
				if (this.vel.z > 0) cbCheck(callbacks.zpos, true, col);
				else cbCheck(callbacks.zneg, true, col);
				hit = true;
			}

			cbCheck(callbacks.general, hit, col);
		}
	}

	readonly wallLimit = (
		bounds: TVector3,
		callbacks?: {
			x?: () => any,
			y?: () => any,
			z?: () => any
		}
	): void => {
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
	}

	readonly subUpdate = (updates?: number): void => {
		this.pos.add(
			Vector3.scale(this.vel, 1 / (updates ? updates : 1))
		);
	}

	readonly update = (): void => { this.vel.add(this.acc); }
}
//#endregion

//#region ColliderN
export interface IColliderN extends INCube {
	vel: VectorN;
	acc: VectorN;
}

export type TColliderN = IColliderN;

/**
 * Helper class for a cuboid 3D collider
 * @class
 */
export class ColliderN extends NCube implements IColliderN {
	static readonly IsColliderN = (obj: any): obj is TColliderN => NCube.IsNCube(obj) && typeCheck<TColliderN>(obj, "vel", "acc");

	vel: VectorN;
	acc: VectorN;

	constructor(pos: TVectorN, size: TVectorN) {
		super(pos, size);

		this.vel = VectorN.setAll(pos, 0);
		this.acc = VectorN.setAll(pos, 0);
	}

	readonly checkCollision = (
		colliders: TColliderN[],
		callbacks?: {
			pos?: Array<(a: TColliderN) => any>,
			neg?: Array<(a: TColliderN) => any>,
			general?: (a: TColliderN) => any
		}
	): void => {
		for (let col of colliders) {
			let hit: boolean = false;
			for(let dim of this.pos.coords){
			let nextPos = VectorN.add(this.pos, { coords: this.vel.coords.map((elem, ind) => ind == dim ? elem : 0) });
			let nextCol = new ColliderN(nextPos, this.size);
				if (col == this) continue;
				if (IntersectionBetween.NCubeAndNCube(col, nextCol)) {
					if (this.vel.coords[dim] > 0) cbCheck(callbacks.pos[dim], true, col);
					else cbCheck(callbacks.neg[dim], true, col);
					hit = true;
				}
			}
			cbCheck(callbacks.general, hit, col);
		}
	}

	readonly wallLimit = (
		bounds: TVectorN,
		callbacks?: Array<(a?: any) => any>
	): void => {
		this.pos.coords.forEach((elem, ind) => {
			if (isLimited(elem, bounds.coords[ind] - this.size.coords[ind])) {
				this.vel.coords[ind] = 0;
				cbCheck(callbacks[ind], true);
			}
		});

		this.pos.limit(VectorN.sub(bounds, this.size));
	}

	readonly subUpdate = (updates?: number): void => {
		this.pos.add(
			VectorN.scale(this.vel, 1 / (updates ? updates : 1))
		);
	}

	readonly update = (): void => { this.vel.add(this.acc); }
}
//#endregion
//#endregion

//#region Button
export interface IButton extends IBox {
	onClick: () => any;
}

/**
 * Helper class for an arbitrary button
 * @class
 */
export class Button extends Box implements IButton {
	static readonly IsButton = (obj: any): obj is IButton => Box.IsBox(obj) && typeCheck<IButton>(obj, "onClick");

	onClick: () => any;

	constructor(onClick: () => any, a = 0, b = 0, c = 0, d = 0) {
		super(a, b, c, d);

		this.onClick = onClick;
	}

	readonly wasClicked = (clickPos: IVector2): boolean => IntersectionBetween.Point2DAndBox(clickPos, this);
}
//#endregion

//#region Cards
//#region Card
export interface ICard {
	numI: number;
	suitI: number;
	num: string;
	suit: string;
	name: string;
	flipped: boolean;
	sprite: HTMLImageElement;
}

export const ImageFromSrc = (src: string): HTMLImageElement => {
	let tempImg = new Image();
	tempImg.src = src;
	return tempImg;
}

/**
 * Helper Class for a playing card
 * @class
 */
export class Card implements ICard {
	static readonly IsCard = (obj: any): obj is ICard => typeCheck<ICard>(obj, "numI", "suitI", "num", "suit", "name", "flipped", "sprite");

	static readonly SUITS = ['C', 'S', 'H', 'D'];
	static readonly CARDVALS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

	static readonly cardBack: HTMLImageElement = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Back.png");
	static readonly cardHighlight: HTMLImageElement = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Highlight.png");
	static readonly cardOutline: HTMLImageElement = ImageFromSrc("https://lightningund.github.io/Methlib/Images/Outline.png");

	numI: number;
	suitI: number;
	num: string;
	suit: string;
	name: string;
	flipped: boolean;
	sprite: HTMLImageElement;

	constructor(a?: number | ICard, b?: number, f?: boolean) {
		if (Card.IsCard(a)) {
			this.numI = a.numI;
			this.suitI = a.suitI;
			this.flipped = a.flipped;
		} else {
			this.numI = b !== undefined ? b : 0;
			this.suitI = a !== undefined ? a as number : 0;
			this.flipped = f !== undefined ? f : false;
		}

		this.num = Card.CARDVALS[this.numI];
		this.suit = Card.SUITS[this.suitI];

		this.name = this.num + this.suit;

		this.sprite = new Image(1000, 1000);
		this.sprite.src = "https://lightningund.github.io/Methlib/Images/" + this.suit + this.num + ".png";
	}

	static readonly getVal = (card: ICard): number => {
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
	}

	readonly getVal = (): number => Card.getVal(this);

	static readonly flip = (card: ICard): Card => {
		let temp = new Card(card);
		temp.flipped = !temp.flipped;
		return temp;
	}

	readonly flip = (): Card => { this.flipped = !this.flipped; return this; }
}
//#endregion

//#region Deck
export interface IDeck {
	cards: Card[];
}

/**
 * Helper Class for a deck of playing cards
 * @class
 */
export class Deck implements IDeck {
	static readonly IsDeck = (obj: any): obj is IDeck => typeCheck<IDeck>(obj, "cards");

	cards: Card[];

	constructor() {
		this.cards = [];

		for (let i: number = 0; i < Card.SUITS.length; i++) {
			for (let j: number = 0; j < Card.CARDVALS.length; j++) {
				this.cards.push(new Card(i, j));
			}
		}
	}

	static readonly shuffle = (deck: IDeck): Deck => {
		let temp = new Deck();
		temp.cards = randomize(deck.cards);
		return temp;
	}
	readonly shuffle = (): void => { this.cards = randomize(this.cards); }

	readonly takeTopCard = (): Card => this.cards.splice(0, 1)[0];

	readonly takeNthCard = (n: number): Card => this.cards.splice(n, 1)[0];

	readonly addCard = (newCard: Card): void => { this.cards.push(newCard); }
	readonly addCards = (newCards: Card[]): void => { this.cards.push(...newCards); }
}
//#endregion
//#endregion

//#region Canvas

export enum EllipseMode {
	CENTER,
	CORNER,
}

export enum RectMode {
	CENTER,
	CORNER,
}

export enum ColorMode {
	RGB,
	HSV,
}

export class Canvas {
	private canv: HTMLCanvasElement;
	private ctxt: CanvasRenderingContext2D;

	private strokeOff: boolean = false;
	private fillOff: boolean = false;
	private currentEllipseMode: EllipseMode;
	private currentRectMode: RectMode;
	private currentColorMode: ColorMode;

	constructor(canv: HTMLCanvasElement) {
		this.canv = canv;
		this.ctxt = canv.getContext("2d");
	}

	readonly background = (col: TColor): void => {
		let w: number = this.canv.width;
		let h: number = this.canv.height;

		this.ctxt.save();

		this.ctxt.fillStyle = Color.getRGBAHex(col);
		
		this.ctxt.fillRect(0, 0, w, h);

		this.ctxt.restore();
	}

	readonly ellipse = (x: number, y: number, width: number, height: number): void => {
		let xRad = width / 2;
		let yRad = height / 2;

		this.ctxt.beginPath();

		this.ctxt.ellipse(x, y, xRad, yRad, 0, 0, Math.PI * 2);
		this.fillOrStroke();
	}

	readonly rect = (x: number, y: number, width: number, height: number): void => {
		this.ctxt.beginPath();

		this.ctxt.rect(x, y, width, height);
		this.fillOrStroke();
	}

	readonly line = (x1: number, y1: number, x2?: number, y2?: number): void => {
		if (!this.strokeOff) {
			this.ctxt.beginPath();

			this.ctxt.moveTo(x1, y1);

			this.ctxt.lineTo(x2, y2);

			this.ctxt.stroke();
		}
	}

	readonly point = (x: number, y: number): void => {
		if (!this.strokeOff) {
			this.line(x, y, x, y);
		}
	}

	readonly font = (fontStr: string): void => {
		this.ctxt.font = fontStr;
	}

	readonly text = (str: string, x: number, y: number): void => {
		if (!this.fillOff) {
			this.ctxt.fillText(str, x, y);
		}
		if (!this.strokeOff) {
			this.ctxt.strokeText(str, x, y);
		}
	}

	readonly arc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): void => {
		this.ctxt.beginPath();
		this.ctxt.arc(x, y, radius, startAngle, endAngle); 1
		this.fillOrStroke();
	}

	readonly noStroke = (): void => {
		this.strokeOff = true;
	}

	readonly stroke = (col: TColor): void => {
		this.ctxt.strokeStyle = Color.getRGBAHex(col);
		this.strokeOff = false;
	}

	readonly strokeWeight = (weight: number): void => {
		this.ctxt.lineWidth = weight;
	}

	readonly noFill = (): void => {
		this.fillOff = true;
	}

	readonly fill = (col: TColor): void => {
		this.ctxt.fillStyle = Color.getRGBAHex(col);
		this.fillOff = false;
	}

	readonly ellipseMode = (newMode: EllipseMode): void => {
		this.currentEllipseMode = newMode;
	}

	readonly rectMode = (newMode: RectMode): void => {
		this.currentRectMode = newMode;
	}

	readonly colorMode = (newMode: ColorMode): void => {
		this.currentColorMode = newMode;
	}

	private readonly fillOrStroke = (): void => {
		if (!this.fillOff) {
			this.ctxt.fill();
		}

		if (!this.strokeOff) {
			this.ctxt.stroke();
		}
	}
}
//#endregion

//#endregion

//#region Constants
//#region Exported
export const E: number = 2.7182818;
export const PI: number = 3.1415926;
export const PHI: number = 1.6180339;
//#endregion

//#region Internal
const romChars: string[] = ['I', 'V', 'X', 'L', 'D', 'C', 'M', 'v', 'x', 'l', 'd', 'c', 'm'];

const romVals: number[] = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

let maxVal: number = romVals[romVals.length - 1] * 3;
for (let i = 0; i < romVals.length / 2; i++) {
	maxVal += romVals[i * 2 + 1];
}

const MRV: number = maxVal;
//#endregion
//#endregion

//#region Functions

var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;

/**
 * Determines the minimum and maximum of an array of things of varying lengths
 * @param minMax The array of things passed in
 * @param defMin The default minimum
 * @param defMax The default maximum
 * @returns an array of the min and max
 */
const minAndMax = (
	minMax: any[],
	defMin: any,
	defMax: any
): any[] => {
	let min: any = minMax.length > 1 ? minMax[0] : defMin;
	let max: any = minMax.length > 1 ? minMax[1] : minMax.length > 0 ? minMax[0] : defMax;
	return [min, max];
}

const cbCheck = (
	cb: (...par: any[]) => any,
	cond: boolean,
	...params: any[]
): void => {
	if (cb !== undefined && cond) cb(params);
}

const posAndSize = (
	obj: TBox,
	a?: number | IVector2 | TBox,
	b?: number | IVector2,
	c?: number | IVector2,
	d?: number
): void => {
	if (a !== undefined) {
		if (Box.IsBox(a)) {
			obj.pos = a.pos;
			obj.size = a.size;
		} else if (Vector2.IsVector2(a)) {
			obj.pos = Vector2.copy(a as IVector2);
			obj.size = new Vector2(...(
				Vector2.IsVector2(b) ? [b as IVector2] : [b as number, c as number]
			));
		} else {
			obj.pos = new Vector2(a as number, b as number);
			obj.size = new Vector2(...(
				Vector2.IsVector2(c) ? [c as IVector2] : [c as number, d as number]
			));
		}
	} else {
		obj.pos = new Vector2(0, 0);
		obj.size = new Vector2(0, 0);
	}
}

const timeForm = (val: number, measurement: string): string => val.toString() + measurement + (val > 1 ? "s" : "");

export const padArr = (inArr: any[], targetLen: number, padStr?: string): any[] => {
	let padWith: any[] = padStr === undefined ? ["0"] : Array.from(padStr);
	for (let i = inArr.length; i < targetLen; i += padWith.length) {
		inArr.unshift(...padWith);
	}
	for (let i = inArr.length; i > targetLen; i--) {
		inArr.shift();
	}
	return inArr;
}

//#region Checkers
//#region IntersectionChecks
export class IntersectionBetween {
	//point & range
	static readonly Point1DAndRange = (point: number, range: TRange): boolean => point > range.start && point < range.start + range.size;
	//range & range
	static readonly RangeAndRange = (a: TRange, b: TRange): boolean => (a.start + a.size >= b.start) && (b.start + b.size >= a.start);

	//point & point
	static readonly Point2DAndPoint2D = (pointA: TVector2, pointB: TVector2): boolean => pointA.x == pointB.x && pointA.y == pointB.y;
	//point & line
	static readonly Point2DAndLineInf2D = (point: TVector2, line: TLineInf2D): boolean => {
		let pointToSourceVec: Vector2 = Vector2.sub(line.source, point);
		return line.angle == pointToSourceVec.heading();
	}
	//point & line segment
	static readonly Point2DAndLineSegment2D = (point: TVector2, line: TLineSegment2D): boolean => {
		let pointToAVec: Vector2 = Vector2.sub(line.a, point);
		let pointToBVec: Vector2 = Vector2.sub(line.b, point);
		let AToBVec: Vector2 = Vector2.sub(line.b, line.a);
		let withinARange: boolean = pointToAVec.squareLength() < AToBVec.squareLength();
		let withinBRange: boolean = pointToBVec.squareLength() < AToBVec.squareLength();
		return AToBVec.heading() == pointToAVec.heading() && withinARange && withinBRange;
	}
	//point & box
	static readonly Point2DAndBox = (point: TVector2, box: TBox): boolean => {
		let xRange: CRange = new CRange(box.pos.x, box.size.x);
		let yRange: CRange = new CRange(box.pos.y, box.size.y);

		return IntersectionBetween.Point1DAndRange(point.x, xRange) && IntersectionBetween.Point1DAndRange(point.y, yRange);
	}
	//point & circle
	static readonly Point2DAndCircle = (point: TVector2, circle: TCircle): boolean => Vector2.dist(point, circle.center) <= circle.radius;

	//3D point & 3D line
	//3D point & 3D line segment
	//3D point & cube
	//3D point & sphere

	//line & line
	//line & line segment
	//line & box
	static readonly LineInf2DAndBox = (line: TLineInf2D, box: TBox) => {
		let boxCorners: TVector2[] = [
			box.pos,
			Vector2.add(box.pos, { x: box.size.x, y: 0 }),
			Vector2.add(box.pos, { x: 0, y: box.size.y }),
			Vector2.add(box.pos, box.size)
		];

		let pointToCornerLines: TLineInf2D[] = boxCorners.map(corner => new LineInf2D(line.source, corner));

		let pointToCornerAngles: number[] = pointToCornerLines.map(PTCL => PTCL.angle);

		let angleA: number = Math.max(...pointToCornerAngles);
		let angleB: number = Math.min(...pointToCornerAngles);

		return line.angle < angleA && line.angle > angleB;
	}
	//line & circle
	//line & sphere

	//line segment & line segment
	//line segment & box
	//line segment & circle

	//3D line & 3D line
	//3D line & 3D line segment
	//3D line & cube
	//3D line & sphere

	//3D line segment & 3D line segment
	//3D line segment & cube
	//3D line segment & sphere

	//box & box
	static readonly BoxAndBox = (a: TBox, b: TBox): boolean => {
		let xa: CRange = new CRange(a.pos.x, a.size.x);
		let xb: CRange = new CRange(b.pos.x, b.size.x);
		let ya: CRange = new CRange(a.pos.y, a.size.y);
		let yb: CRange = new CRange(b.pos.y, b.size.y);

		return (IntersectionBetween.RangeAndRange(xa, xb) && IntersectionBetween.RangeAndRange(ya, yb));
	}
	//box & circle

	//circle & cube
	//circle & sphere

	//cube & cube
	static readonly CubeAndCube = (a: TCube, b: TCube): boolean => {
		let xya = new Box(new Vector2(a.pos.x, a.pos.y), new Vector2(a.size.x, a.size.y));
		let xyb = new Box(new Vector2(b.pos.x, b.pos.y), new Vector2(b.size.x, b.size.y));
		let xza = new Box(new Vector2(a.pos.x, a.pos.z), new Vector2(a.size.x, a.size.z));
		let xzb = new Box(new Vector2(b.pos.x, b.pos.z), new Vector2(b.size.x, b.size.z));
		let yza = new Box(new Vector2(a.pos.y, a.pos.z), new Vector2(a.size.y, a.size.z));
		let yzb = new Box(new Vector2(b.pos.y, b.pos.z), new Vector2(b.size.y, b.size.z));

		return (IntersectionBetween.BoxAndBox(xya, xyb) && IntersectionBetween.BoxAndBox(xza, xzb) && IntersectionBetween.BoxAndBox(yza, yzb));
	}
	//cube & sphere

	//sphere & sphere

	//NCube & NCube
	static readonly NCubeAndNCube = (a: TNCube, b: TNCube): boolean => {
		let aRanges: CRange[] = a.pos.coords.map((elem, ind) => new CRange(elem, a.size.coords[ind]));
		let bRanges: CRange[] = b.pos.coords.map((elem, ind) => new CRange(elem, b.size.coords[ind]));

		let overlap: boolean = true;
		aRanges.forEach((elem, ind) => {if(!IntersectionBetween.RangeAndRange(elem, bRanges[ind])) overlap = false;});
		return overlap;
	}
}
//#endregion

/** Brute force prime checker */
export const isPrime = (val: number): boolean => {
	for (let i: number = 2; i < Math.sqrt(val); i++) {
		if (isPrime(i)) {
			if (gcd(i, val) != 1) {
				return false;
			}
		}
	}
	return true;
}

/** Determines if two numbers are coprime to each other */
export const areCoprime = (a: number, b: number): boolean => gcd(a, b) == 1;

/** Check if a given value would be truncated with the given lower and upper limits */
export const isLimited = (limitee: number, ...minMaxIn: number[]): boolean => {
	let minMax: number[] = minAndMax(minMaxIn, 0, 1);

	return (limitee <= minMax[0] || limitee >= minMax[1]);
}
//#endregion

//#region Math
/** The logarithm of a number with an arbitrary base */
export const logb= (val: number, base: number): number => Math.log(val) / Math.log(base);

/** Return the greatest common denominator */
export const gcd = (a: number, b: number): number => {
	while (true) {
		if (a > b) {
			a -= b;
		} else if (b > a) {
			b -= a;
		} else {
			return a;
		}
	}
}

/** Return the lowest common multiple */
export const lcm = (a: number, b: number): number =>(a * b) / gcd(a, b);

/**
 * More efficient use of ^ and % together by using the modulus throughout the power-ing
 * @param b Base
 * @param e Exponent
 * @param m Modulus
 * @returns (b^e) % m
 */
export const modPow = (
	b: number,
	e: number,
	m: number
): number => {
	let modPow: number = 1;

	for (let i = 0; i < e; i++) {
		modPow *= b;
		modPow %= m;
	}

	return modPow;
}

/** No Idea */
export const eTot = (val: number): number => {
	let numCoprimes: number = 0;

	for (let i = 0; i < val; i++) {
		if (gcd(i, val) == 1) {
			numCoprimes++;
		}
	}

	return numCoprimes;
}

//TODO:Figure out what the hell is happening with this and why it just doesn't work sometimes
/** No Idea */
export const carmichael = (val: number): number => {
	let m: number = 0;
	let coprimes: number[] = findCoprimesLessThan(val);
	while (m < val * 10) {
		m++;
		let success: boolean = true;
		for (let a of coprimes) {
			if (Math.pow(a, m) % val != 1) {
				success = false;
				break;
			}
		}
		if (!success) {
			continue;
		} else {
			return m;
		}
	}
	return -1;
}

/** No Idea */
export const extendedEuclid = (a: number, b: number): number => {
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
}

/** Find all numbers that are less than n and are coprime to it */
export const findCoprimesLessThan = (n: number): number[] => {
	let coprimes: number[] = [];

	for (let i: number = 0; i < n; i++) {
		if (areCoprime(i, n)) {
			coprimes.push(i);
		}
	}

	return coprimes;
}

/** Return an array of numbers coprime to n of length len */
export const findCoprimeList = (n: number, len: number): number[] => {
	let coprimes: number[] = [];
	let checkNum: number = 1;

	while (coprimes.length < len) {
		if (areCoprime(checkNum, n)) {
			coprimes.push(checkNum);
		}
		checkNum++;
	}

	return coprimes;
}
//#endregion

//#region DoStuff
/** Return a truncated version of a value between the lower and upper limits */
export const limit = (limitee: number, ...minMaxIn: number[]): number => {
	let minMax: number[] = minAndMax(minMaxIn, 0, 1);

	if (limitee <= minMax[0]) return minMax[0];
	if (limitee >= minMax[1]) return minMax[1];
	return limitee;
}

/** RSA encryption */
export const RSAEncrypt = (
	message: string,
	n: number,
	k: number
): number[] => {
	let BEM: number[] = [];
	let CA: string[] = message.split("");
	for (let i in CA) {
		let NC: number = parseInt(CA[i]);
		BEM[i] = modPow(NC, k, n);
	}
	return BEM;
}

/** RSA decryption */
export const RSADecrypt = (
	ENCMess: number[],
	n: number,
	j: number
): string => {
	let message: string = "";
	for (let i of ENCMess) {
		let NC: number = modPow(i, j, n);
		message += NC.toString();
	}
	return message;
}

/** Generate an MLA Citation */
export const MLA_Citation = (
	quote: string,
	act: number,
	scene: number,
	lineStart: number,
	lineEnd: number
): string => {
	let modQuote: string;

	if (lineEnd - lineStart < 2) {
		modQuote = quote;
	} else {
		let quoteWords: string[] = quote.split(" ");
		modQuote = quoteWords[0] + " " + quoteWords[1] + " ... " + quoteWords[quoteWords.length - 2] + " " + quoteWords[quoteWords.length - 1];
	}

	return "'" + modQuote + "' (" + romanNumerals(act) + ", " + scene + ", " + lineStart + "-" + lineEnd + ")";
}

/**
 * Formats a time from a number into something human-readable
 * @param time The time to format in seconds
 * @returns A formatted string with days, hours, minutes, and seconds
 */
export const prettyTime = (time: number): string => {
	let seconds: number = time;
	let minutes: number = Math.floor(seconds / 60);
	let hours: number = Math.floor(minutes / 60);
	let days: number = Math.floor(hours / 24);

	seconds %= 60;
	minutes %= 60;
	hours %= 24;

	let out_string: string[] = [];

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
}

/** Generate the Roman numeral equivalent of a given number */
export const romanNumerals = (val: number): string => {
	let romanNum: string = "";
	let tenthPower: number = Math.ceil(logb(val, 10)) + 1;

	if (val > MRV) throw "Number too large";
	for (let i: number = tenthPower; i > 0; i--) {
		let workingString: string = "";
		let operatingNum: number = Math.floor(val / Math.pow(10, i - 1));
		operatingNum -= Math.floor(val / Math.pow(10, i)) * 10;

		//check which of 4 general categories the digit is in:1-3, 4, 5-8, 9 (there is probably a much better way to do this)
		if (operatingNum < 4) {
			for (let j: number = 0; j < operatingNum; j++) {
				workingString += romChars[(i - 1) * 2];
			}
		} else if (operatingNum == 4) {
			workingString = romChars[(i - 1) * 2] + romChars[(i - 1) * 2 + 1];
		} else if (operatingNum == 5) {
			workingString = romChars[(i - 1) * 2 + 1];
		} else if (operatingNum == 9) {
			workingString = romChars[(i - 1) * 2] + romChars[i * 2];
		} else {
			workingString = romChars[(i - 1) * 2 + 1];
			for (let j: number = 0; j < operatingNum - 5; j++) {
				workingString += romChars[(i - 1) * 2];
			}
		}
		romanNum += workingString;
	}
	return romanNum;
}

/**
 * Remove a given value from the array
 * @param arr The array
 * @param val The value to be removed
 */
export const removeFromArray = (arr: any[], val: any): any[] => {
	let i: number = arr.indexOf(val);
	if (i != -1) arr.splice(i, 1);
	return arr;
}
//#endregion

//#region Random
/** Randomize an array and return it (does not modify the input array) */
export const randomize = (inArr: any[]): any[] => {
	let outArr: any = [];
	let numLoops: number = inArr.length;
	let indices: number[] = [];
	for (let i: number = 0; i < numLoops; i++) {
		indices[i] = i;
	}

	for (let i = 0; i < numLoops; i++) {
		let index: number = indices[Math.floor(random(indices.length))];
		outArr[i] = inArr[index];
		indices = removeFromArray(indices, index);
	}
	return outArr;
}

/** Return a random value between the maximum and minimum value */
export const random = (...minMaxIn: number[]): number => {
	let minMax: number[] = minAndMax(minMaxIn, 0, 1);

	return (Math.random() * (minMax[1] - minMax[0])) + minMax[0];
}

/** Generate and return a random color */
export const randomColor = (): Color => {
	let r: number = Math.floor(random(255));
	let g: number = Math.floor(random(255));
	let b: number = Math.floor(random(255));

	return new Color(r, g, b);
}
//#endregion
//#endregion
