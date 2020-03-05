"use strict";

/*
* Original Author: Ben Love
* Purpose: To store any and all helper functions you could need
* See the README for styling rules
*/

//region CONSTANTS
//region CLASSES
//Color
const limCol = v => typeof v == "undefined" ? 0 : (v > 255 ? 255 : (v < 0 ? 0 : v));
const hexCol = v => (limCol(v) < 16 ? "0" : "") + v.toString(16);

class Color {
	static getRGBFunc = c => `rgb(${limCol(c.r)}, ${limCol(c.g)}, ${limCol(c.b)})`;
	static getRGBAFunc = c => `rgba(${limCol(c.r)}, ${limCol(c.g)}, ${limCol(c.b)}, ${limCol(c.a)})`;

	static getRGBHex = c => "#" + hexCol(c.r) + hexCol(c.g) + hexCol(c.b);
	static getRGBAHex = c => Color.getRGBHex(c) + hexCol(c.a);

	constructor(r, g, b, a) {
		this.r, this.g, this.b, this.a;

		if(typeof r.r != "undefined"){
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;
			if(typeof r.a != "undefined"){
				this.a = r.a;
			} else {
				this.a = arguments.length == 1 ? 255 : g;
			}
		} else {
			if(arguments.length == 0) {
				this.r = 0;
				this.g = 0;
				this.b = 0;
				this.a = 255;
			} else if(arguments.length == 1) {
				this.r = r;
				this.g = r;
				this.b = r;
				this.a = 255;
			} else if(arguments.length == 2) {
				this.r = r;
				this.g = r;
				this.b = r;
				this.a = g;
			} else if(arguments.length == 3) {
				this.r = r;
				this.g = g;
				this.b = b;
				this.a = 255;
			} else {
				this.r = r;
				this.g = g;
				this.b = b;
				this.a = a;
			}
		}

		this.getRGBFunc = () => `rgb(${this.r}, ${this.g}, ${this.b})`;
		this.getRGBAFunc = () => `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;

		this.getRGBHex = () => "#" + hexCol(this.r) + hexCol(this.g) + hexCol(this.b);
		this.getRGBAHex = () => this.getRGBHex() + hexCol(this.a);
	}
}

//Tetris Piece
class Piece {
	constructor(parts) {
		this.p = parts;
	}
}

//Tetris Piece with all 4 rotations
class PieceF {
	constructor(pieceRots, color) {
		this.rot = pieceRots;
		this.col = color;
	}
}

//Honestly this was just for Tetris I don't know what purpose this serves otherwise
class Cell {
	constructor(isOn = false, color = new Color(), prevColor = new Color()) {
		this.on = isOn;
		this.col = color;
		this.prevCol = prevColor;
	}
}

// class Vector {
// 	//Static Functions to use without reference to a specific instance of a vector

// 	//Take a vector and create a new vector2 from it
// 	static copy = a => new Vector(a);
	
// 	//Add two vectors
// 	static add = (a, b) => new Vector(a.dimension, a.coords.map((c, i) => c+= b.coords[i]));

// 	//Subtract two vectors
// 	static sub = (a, b) => new Vector(a.dimension, a.coords.map((c, i) => c-= b.coords[i]));

// 	//scale a vector by a set value
// 	static scale = (a, scalar) => new Vector(a.dimension, a.coords.map(c => c*= scalar));

// 	//Add a flat value to both values of the vector
// 	static addAll = (a, addend) => new Vector(a.dimension, a.coords.map(c => c+= addend));

// 	//Find the length of a vector
// 	static length = a => Math.sqrt(a.coords.reduce((t, c) => t + Math.pow(c, 2), 0));

// 	//Find the length of a vector but squared
// 	//(saves on resources because Math.sqrt is pretty expensive time wise)
// 	static squareLength = a => a.coords.reduce((t, c) => t + Math.pow(c, 2), 0);

// 	//Normalize a vector (scale it so it's length is 1) and return the result
// 	static normalize = a => Vector.scale(a, 1 / a.length());

// 	static dist = (a, b) => Math.sqrt(a.coords.reduce((t, c, i) => t + Math.pow(c - a.coords[i], 2), 0));
// 	static distSquared = (a, b) => a.coords.reduce((t, c, i) => t + Math.pow(c - a.coords[i], 2), 0);

// 	constructor(dimension) {
// 		if(dimension instanceof Vector){
// 			this.coords = dimension.coords;
// 			this.dimension = dimension.dimension;
// 		} else {
// 			this.coords = []
// 			this.dimension = dimension;
// 			for(let i = 0; i < this.dimension; i++){
// 				this.coords[i] = arguments[i + 1];
// 			}
// 		}

// 		//Make a duplicate of this vector
// 		this.copy = () => new Vector(this);

// 		//Add another vector to this one and return the result
// 		this.add = addend => {
// 			this.coords.map((c, i) => c+= addend.coords[i]);
// 			return this;
// 		}

// 		//Subtract another vector from this one and return the result
// 		this.sub = subtrahend => {
// 			this.coords.map((c, i) => c-= subtrahend.coords[i]);
// 			return this;
// 		}

// 		//Scale this vector by a number and return the result
// 		this.scale = scalar => {
// 			this.coords.map(c => c*= scalar);
// 			return this;
// 		}

// 		//Add a flat value to both values of the vector
// 		this.addAll = addend => {
// 			this.coords.map(c => c+= addend);
// 			return this;
// 		}

// 		//Return the length of this vector according to c = sqrt(a^2 + b^2)
// 		this.length = () => Math.sqrt(this.coords.reduce((t, c) => t + Math.pow(c, 2), 0));

// 		//Find the length of this vector but squared
// 		//(saves on resources because Math.sqrt is pretty expensive time wise)
// 		this.squareLength = () => this.coords.reduce((t, c) => t + Math.pow(c, 2), 0);

// 		//Normalize this vector (scale it so it's length is 1) and return the result
// 		this.normalize = () => this.scale(1 / this.length());

// 		this.dist = a => Math.sqrt(this.coords.reduce((t, c, i) => t + Math.pow(c - a.coords[i], 2), 0));
// 		this.distSquared = a => this.coords.reduce((t, c, i) => t + Math.pow(c - a.coords[i], 2), 0);
// 	}
// }

//Helper class for 2D vectors
class Vector2 {
	//Static Functions to use without reference to a specific instance of a vector

	//Take a vector and create a new vector2 from it
	static copy = a => new Vector2(a);
	
	//Add two vectors
	static add = (a, b) => new Vector2(a.x + b.x, a.y + b.y);

	//Subtract two vectors
	static sub = (a, b) => new Vector2(a.x - b.x, a.y - b.y);

	//scale a vector by a set value
	static scale = (a, scalar) => new Vector2(a.x * scalar, a.y * scalar);

	//Add a flat value to both values of the vector
	static addBoth = (a, addend) => new Vector2(a.x + addend, a.y + addend);

	//Find the angle of a vector
	static heading = a => Math.atan2(a.x, a.y);

	//Find the length of a vector
	static length = a => Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));

	//Find the length of a vector but squared
	//(saves on resources because Math.sqrt is pretty expensive time wise)
	static squareLength = a => Math.pow(a.x, 2) + Math.pow(a.y, 2);

	//Normalize a vector (scale it so it's length is 1) and return the result
	static normalize = a => Vector2.scale(a, 1 / a.length());

	//Limit a vector to a rectangle defined by the lower and upper limits forming the corners and return the result
	static limit = function(a, min, max) {
		let minMax = minAndMax(arguments.length + 1, min, max, new Vector2(0, 0), new Vector2(1, 1));
		return vectorLimit(a, minMax[0], minMax[1]);
	}

	static dist = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	static distSquared = (a, b) => Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);

	constructor(x = 0, y = 0) {
		if(typeof x.x != "undefined") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}

		//Make a duplicate of this vector
		this.copy = () => new Vector2(this);

		//Add another vector to this one and return the result
		this.add = addend => {
			this.x += addend.x;
			this.y += addend.y;
			return this;
		}

		//Subtract another vector from this one and return the result
		this.sub = subtrahend => {
			this.x -= subtrahend.x;
			this.y -= subtrahend.y;
			return this;
		}

		//Scale this vector by a number and return the result
		this.scale = scalar => {
			this.x *= scalar;
			this.y *= scalar;
			return this;
		}

		//Add a flat value to both values of the vector
		this.addBoth = addend => {
			this.x += addend;
			this.y += addend;
			return this;
		}

		//Find the angle of this vector
		this.heading = () => Vector2.heading(this);

		//Return the length of this vector according to c = sqrt(a^2 + b^2)
		this.length = () => Vector2.length(this);

		//Find the length of this vector but squared
		//(saves on resources because Math.sqrt is pretty expensive time wise)
		this.squareLength = () => Vector2.squareLength(this);

		//Normalize this vector (scale it so it's length is 1) and return the result
		this.normalize = () => this.scale(1 / this.length());

		//Limit this vector to a rectangle defined by the lower and upper limits forming the corners and return the result
		this.limit = function(a, b) {
			let n;
			if(typeof a.x != "undefined"){
				n = vectorLimit(this, a);
			} else {
				let minMax = minAndMax(arguments.length + 1, a, b, new Vector2(0, 0), new Vector2(1, 1));
				n = vectorLimit(this, minMax[0], minMax[1]);
			}
			this.x = n.x;
			this.y = n.y;
			return this;
		}

		this.dist = a => Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2));
		this.distSquared = a => Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2);
	}
}

const cbCheck = function (cb, cond = true) {
	if(cond) {
		if(typeof cb == "function") {
			cb(arguments.split(2));
		}
	}
}

// General 2d rectangle (this was supposed to be collider but that spiraled out of control so now we have this)
class Box {
	static getCenter = box => Vector2.add(box.pos, Vector2.scale(box.size, 1 / 2));

	constructor(a = 0, b = 0, c = 0, d = 0) {
		posAndSize(this, a, b, c, d);

		this.render = (context, color) => {
			if(typeof color != "undefined"){
				context.fillStyle = color instanceof Color ? color.getRGBAFunc() : color;
			}
			context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}

		this.getCenter = () => Vector2.add(this.pos, Vector2.scale(this.size, 1 / 2));
	}
}

//Helper class for a rectangular 2D collider
class Collider extends Box {
	constructor(a = 0, b = 0, c = 0, d = 0) {
		super(a, b, c, d);

		this.vel = new Vector2();
		this.acc = new Vector2();

		this.checkCollision = (colliders, uCB, dCB, lCB, rCB, aCB) => {
			let nextPosX = Vector2.add(this.pos, {x:this.vel.x, y:0});
			let nextPosY = Vector2.add(this.pos, {x:0, y:this.vel.y});

			let nextColX = new Collider(nextPosX, this.size);
			let nextColY = new Collider(nextPosY, this.size);

			let uHit = false, dHit = false, lHit = false, rHit = false;

			for(let col of colliders) {
				if(col == this) continue;
				if(overlap(col, nextColY)) {
					if(this.vel.y > 0) uHit = true;
					else dHit = true;
				}
				if(overlap(col, nextColX)) {
					if(this.vel.x > 0) lHit = true;
					else rHit = true;
				}
			}
			cbCheck(uCB, uHit, col);
			cbCheck(dCB, dHit, col);
			cbCheck(lCB, lHit, col);
			cbCheck(rCB, rHit, col);
			cbCheck(aCB, uHit || dHit || lHit || rHit, col);
		}

		this.wallLimit = (bounds, gCB, wCB) => {
			let wH = false, gH = false;
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
		}

		this.subUpdate = (updates = 1) => {this.pos.add(Vector2.scale(this.vel, 1 / updates));}

		this.update = () => {this.vel.add(this.acc);}
	}
}

//Helper class for an arbitrary button
class Button extends Box{
	constructor(onClick = () => {}, a = 0, b = 0, c = 0, d = 0) {
		super(a, b, c, d);

		if(typeof onClick != "function") throw "onClick is not a function";

		this.onClick = onClick;

		this.wasClicked = clickPos => pointOverlap(clickPos, this);
	}
}

//Helper Class for playing cards
class Card {
	static getVal = card => {
		let val;
		switch(card.num){
			case "A":
				val = 1;
				break;
			case "J":
			case "Q":
			case "K":
				val = 10;
				break;
			default:
				val = parseInt(card.num);
				break;
		}
		return val;
	}

	static flip = card => {
		let temp = new Card(card);
		temp.flipped = !temp.flipped;
		return temp;
	}

	constructor(a = 0, b = 0, f = false) {
		if(a instanceof Card){
			this.numI = a.numI;
			this.suitI = a.suitI;
			this.num = a.num;
			this.suit = a.suit;
			this.flipped = a.flipped;
			this.sprite = a.sprite;
		} else {
			this.numI = b;
			this.suitI = a;
			this.num = CARDVALS[this.numI];
			this.suit = SUITS[this.suitI];
			this.flipped = f;
			this.sprite = new Image(1000, 1000);
			this.sprite.src = "https://javakid0826.github.io/Methlib-js/Images/" + this.suit + this.num + ".png";
		}

		this.name = () => this.num + this.suit;

		this.flip = () => {this.flipped = !this.flipped;}

		this.getVal = () => Card.getVal(this);
	}
}

//Helper Class for a deck of playing cards
class Deck {
	static shuffle = deck => {
		let temp = new Deck();
		temp.cards = randomize(deck.cards);
		return temp;
	}

	constructor() {
		this.cards = [];

		for (let i in SUITS) {
			for (let j in CARDVALS) {
				this.cards.push(new Card(i, j));
			}
		}

		this.takeTopCard = () => this.cards.splice(0, 1)[0];

		this.takeNthCard = n => this.cards.splice(n, 1)[0];

		this.addCard = newCard => {this.cards.push(newCard);}
		this.addCards = newCards => {this.cards.push(...newCards);}

		this.shuffle = () => {this.cards = randomize(this.cards);}
	}
}
//endregion CLASSES
//region VARIABLES
//Roman Numerals Characters
const romChars = ['I', 'V', 'X', 'L', 'D', 'C', 'M', 'v', 'x', 'l', 'd', 'c', 'm'];

//Their corresponding values
const romVals = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

//Constants
const E = 2.7182818;
const PI = 3.1415926;
const PHI = 1.6180339;

let maxVal = romVals[romVals.length - 1] * 3;
for (let i = 0; i < romVals.length / 2; i++) {
	maxVal += romVals[i * 2 + 1];
}

const MRV = maxVal;

let cardBack = new Image();
cardBack.src = "https://javakid0826.github.io/Methlib-js/Images/Back.png";
let cardHighlight = new Image();
cardHighlight.src = "https://javakid0826.github.io/Methlib-js/Images/Highlight.png";
let cardOutline = new Image();
cardOutline.src = "https://javakid0826.github.io/Methlib-js/Images/Outline.png";

const BLACK = new Color(0, 0, 0, 255);
const GREY = new Color(128, 128, 128, 255);
const WHITE = new Color(255, 255, 255, 255);
const RED = new Color(255, 0, 0, 255);
const GREEN = new Color(0, 255, 0, 255);
const BLUE = new Color(0, 0, 255, 255);
const YELLOW = new Color(255, 255, 0, 255);
const PURPLE = new Color(255, 0, 255, 255);
const CYAN = new Color(0, 255, 255, 255);
const ORANGE = new Color(255, 128, 0, 255);

const SUITS = ['C', 'S', 'H', 'D'];
const CARDVALS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

//Tetris Pieces
const pieces =
[
	//Line Piece
	new PieceF(
		[
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2), new Vector2(3, 2)]),
			new Piece([new Vector2(2, 0), new Vector2(2, 1), new Vector2(2, 2), new Vector2(2, 3)]),
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2), new Vector2(3, 2)]),
			new Piece([new Vector2(1, 0), new Vector2(1, 1), new Vector2(1, 2), new Vector2(1, 3)])
		],
		CYAN
	),
	//L Piece 1
	new PieceF(
		[
			new Piece([new Vector2(2, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(1, 2), new Vector2(1, 3), new Vector2(2, 3)]),
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2), new Vector2(0, 3)]),
			new Piece([new Vector2(0, 1), new Vector2(1, 1), new Vector2(1, 2), new Vector2(1, 3)])
		],
		ORANGE
	),
	//L Piece 2
	new PieceF(
		[
			new Piece([new Vector2(0, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(1, 2), new Vector2(1, 3)]),
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2), new Vector2(2, 3)]),
			new Piece([new Vector2(2, 1), new Vector2(2, 2), new Vector2(1, 3), new Vector2(2, 3)])
		],
		BLUE
	),
	//Square Piece
	new PieceF(
		[
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(1, 2), new Vector2(2, 2)])
		],
		YELLOW
	),
	//Z Piece 1
	new PieceF(
		[
			new Piece([new Vector2(1, 1), new Vector2(2, 1), new Vector2(0, 2), new Vector2(1, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(1, 2), new Vector2(2, 2), new Vector2(2, 3)]),
			new Piece([new Vector2(1, 2), new Vector2(2, 2), new Vector2(0, 3), new Vector2(1, 3)]),
			new Piece([new Vector2(0, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(1, 3)])
		],
		GREEN
	),
	//Z Piece 2
	new PieceF(
		[
			new Piece([new Vector2(0, 1), new Vector2(1, 1), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(2, 1), new Vector2(1, 2), new Vector2(2, 2), new Vector2(1, 3)]),
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(1, 3), new Vector2(2, 3)]),
			new Piece([new Vector2(1, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(0, 3)])
		],
		RED
	),
	//T Piece
	new PieceF(
		[
			new Piece([new Vector2(1, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2)]),
			new Piece([new Vector2(1, 1), new Vector2(1, 2), new Vector2(2, 2), new Vector2(1, 3)]),
			new Piece([new Vector2(0, 2), new Vector2(1, 2), new Vector2(2, 2), new Vector2(1, 3)]),
			new Piece([new Vector2(1, 1), new Vector2(0, 2), new Vector2(1, 2), new Vector2(1, 3)])
		],
		PURPLE
	)
];
//endregion VARIABLES
//All of the functions
//region FUNCTIONS
//Functions that are just do math to things
//region MATHFUNCS
//Basic math functions that are used more like operators
//region BASICMATH
//Super basic math functions that really just are operators at this point
//region OPERATIONS
//Return the logarithm of a number with an arbitrary base
const logb = (number, base) => Math.log(number) / Math.log(base);

//Return the greatest common denominator
const gcd = (a, b) => {
	let exit = false;

	while (!exit) {
		if (a > b) {
			a -= b;
		} else if (b > a) {
			b -= a;
		} else {
			exit = true;
		}
	}
	return a;
}

//Return the lowest common multiple
const lcm = (a, b) => (a * b) / gcd(a, b);

//More efficient use of ^ and % together by using the modulus throughout the power-ing
const modPow = (b, e, m) => {
	let modPow = 1;

	for (let i = 0; i < e; i++) {
		modPow *= b;
		modPow %= m;
	}

	return modPow;
}

//No idea
const eTot = n => {
	let numCoprimes = 0;

	for (let i = 0; i < n; i++) {
		if (gcd(i, n) == 1) {
			numCoprimes++;
		}
	}

	return numCoprimes;
}

//Return the Carmicheal function of a number
//TODO: Figure out what the hell is happening with this and why it just doesn't work sometimes
const carmichael = n => {
	let m = 0;
	let coprimes = findCoprimesLessThan(n);
	while (m < n * 10) {
		m++;
		let success = true;
		for (let a of coprimes) {
			if (Math.pow(a, m) % n != 1) {
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
}
//endregion OPERATIONS

//Brute force prime checker
const isPrime = n => {
	for (let i = 2; i < Math.sqrt(n); i++) {
		if (isPrime(i)) {
			if (gcd(i, n) != 1) {
				return false;
			}
		}
	}
	return true;
}

//Extended Euclid (???????)
const extendedEuclid = (a, b) => {
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

//Return all numbers that are less than n and are coprime to it
const findCoprimesLessThan = n => {
	let coprimes = [];

	for (let i = 0; i < n; i++) {
		if (gcd(i, n) == 1) {
			coprimes.push(checkNum);
		}
	}

	return coprimes;
}

//Return an array of numbers coprime to n of length len
const findCoprimeList = (n, len) => {
	let coprimes = [];
	let checkNum = 1;

	while (coprimes.length < len) {
		if (gcd(checkNum, n) == 1) {
			coprimes.push(checkNum);
		}
		checkNum++;
	}

	return coprimes;
}
//endregion BASICMATH

//Return a truncated version of a value between the lower and upper limits
const limit = function (limitee, a, b) {
	let minMax = minAndMax(arguments.length, a, b, 0, 1);

	if (limitee <= minMax[0]) {
		return minMax[0];
	}
	if (limitee >= minMax[1]) {
		return minMax[1];
	}
	return limitee;
}

//Return a boolean of whether or not a given value would be truncated with the given lower and upper limits
const isLimited = function (limitee, a, b) {
	let minMax = minAndMax(arguments.length, a, b, 0, 1);

	return (limitee <= minMax[0] || limitee >= minMax[1]);
}

//Return a limited version of a vector given a lower and upper limit as vectors which form a rectangle that we truncate it into
const vectorLimit = function (limitee, a, b) {
	let minMax = minAndMax(arguments.length, a, b, new Vector2(0, 0), new Vector2(1, 1));

	limitee.x = limit(limitee.x, minMax[0].x, minMax[1].x);
	limitee.y = limit(limitee.y, minMax[0].y, minMax[1].y);
	return limitee;
}

//Return a boolean of whether or not a given vector would be truncated with the given lower and upper limits
const isVectorLimited = function (limitee, a, b) {
	let minMax = minAndMax(arguments.length, a, b, new Vector2(0, 0), new Vector2(1, 1));
	return (isLimited(limitee.x, minMax[0].x, minMax[1].x) || isLimited(limitee.y, minMax[0].y, minMax[1].y));
}

//Check if a point overlaps a rectangle
const pointOverlap = (p, r) => (
	(p.x > r.pos.x) &&
	(p.x < r.pos.x + r.size.x) &&
	(p.y < r.pos.y + r.size.y) &&
	(p.y > r.pos.y)
);

//Check if two rectangles overlap
const overlap = (a, b) => !(
	(a.pos.x >= b.pos.x + b.size.x) ||
	(b.pos.x >= a.pos.x + a.size.x) ||
	(a.pos.y >= b.pos.y + b.size.y) ||
	(b.pos.y >= a.pos.y + a.size.y)
);

//Check if two ranges overlap
const overlap1D = (a, as, b, bs) => (a + as >= b) && (b + bs >= a);

//Convert a color in HSV format to RGB format
const HSVtoRGB = function (h, s, v) {
	let r, g, b, i, f, p, q, t;

	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}

	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 256),
		g: Math.round(g * 256),
		b: Math.round(b * 256)
	};
}

//RSA encryption
const RSAEncrypt = (message, n, k) => {
	let BEM = [];
	let CA = message.split("");
	for (let i in CA) {
		let NC = parseInt(CA[i]);
		BEM[i] = modPow(NC, k, n);
	}
	return BEM;
}

//RSA decryption
const RSADecrypt = (ENCMess, n, j) => {
	let message = "";
	for (let i of ENCMess) {
		let NC = modPow(i, j, n);
		message += NC.toString();
	}
	return message;
}
//endregion MATHFUNCS

//Stuff that is basically useless to anyone else but we use a lot inside the library
//region INTERNAL
//Return the minimum and maximum according to the number of arguments provided
const minAndMax = (argLength, a, b, minDef, maxDef) => {
	let min, max;

	if(argLength === 1) {
		min = minDef;
		max = maxDef;
	} else if(argLength === 2) {
		min = minDef;
		max = a;
	} else {
		min = a;
		max = b;
	}
	return [min, max];
}

const posAndSize = (obj, a, b, c, d) => {
	if(typeof a.x != "undefined"){
		obj.pos = Vector2.copy(a);
		if(typeof b.x != "undefined"){
			obj.size = Vector2.copy(b);
		} else {
			obj.size = new Vector2(b, c);
		}
	} else {
		obj.pos = new Vector2(a, b);
		if(typeof c.x != "undefined"){
			obj.size = Vector2.copy(c);
		} else {
			obj.size = new Vector2(c, d);
		}
	}
}

//Roman numeral tester
const romNumTest = () => {
	for (let i = 1; i < 101; i++) {
		console.log(i + " : " + romanNumerals(i) + " ");
		if (i % 10 == 0) {
			console.log("");
		}
	}
}

const timeForm = (val, string) => str(val) + string + (val > 1 ? "s" : "");
//endregion INTERNAL

//Exactly what it sounds like, just random shit
//region MISC
//Generate an MLA Citation
const MLA_Citation = (quote, act, scene, lineStart, lineEnd) => {
	let modQuote = null;

	if (lineEnd - lineStart < 2) {
		modQuote = quote;
	} else {
		let quoteWords = quote.split(" ");
		modQuote = quoteWords[0] + " " + quoteWords[1] + " ... " + quoteWords[quoteWords.length - 2] + " " + quoteWords[quoteWords.length - 1];
	}

	return "'" + modQuote + "' (" + romanNumerals(act) + ", " + scene + ", " + lineStart + "-" + lineEnd + ")";
}

//Turns a passed in time (in seconds) into a formatted string with days, hours, minutes, and seconds
const prettyTime = time => {
	let seconds = time;
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);

	seconds%= 60;
	minutes%= 60;
	hours%= 24;

	let out_string = [];

	if(days > 0){
		out_string.push(timeForm(days, " day"));
	}
	if(hours > 0){
		out_string.push(timeForm(hours, " hour"));
	}
	if(minutes > 0){
		out_string.push(timeForm(minutes, " minute"));
	}
	if(seconds > 0){
		out_string.push(timeForm(seconds, " second"));
	}

	return out_string.join(", ");
}

//Generate the Roman numeral equivalent of a given number
const romanNumerals = number => {
	let romanNum = "";
	let tenthPower = Math.ceil(logb(number, 10)) + 1;

	if (number > MRV) throw "Number too large";
	for (let i = tenthPower; i > 0; i--) {
		let workingString = "";
		let operatingNum = Math.floor(number / Math.pow(10, i - 1));
		operatingNum -= Math.floor(number / Math.pow(10, i)) * 10;

		//check which of 4 general categories the digit is in: 1-3, 4, 5-8, 9 (there is probably a much better way to do this)
		if (operatingNum < 4) {
			for (let j = 0; j < operatingNum; j++) {
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
			for (let j = 0; j < operatingNum - 5; j++) {
				workingString += romChars[(i - 1) * 2];
			}
		}
		romanNum += workingString;
	}
	return romanNum;
}

//Randomize an array and return it
const randomize = inArr => {
	let outArr = [];
	let numLoops = inArr.length;
	for (let i = 0; i < numLoops; i++) {
		let index = Math.floor(random(inArr.length));
		outArr[i] = inArr.splice(index, 1)[0];
	}
	return outArr;
}

//Return a random value between the maximum and minimum value
const random = function (a = 0, b = 1) {
	let minMax = minAndMax(arguments.length + 1, a, b, 0, 1);

	return (Math.random() * (minMax[1] - minMax[0])) + minMax[0];
}

//Generate and return a random color
const randomColor = () => {
	let r = Math.floor(random(255));
	let g = Math.floor(random(255));
	let b = Math.floor(random(255));

	return new Color(r, g, b);
}

const removeFromArray = (arr, val) => {
	let i = arr.indexOf(val);
	if(i != -1) arr.splice(i, 1);
}
//endregion MISC
//endregion FUNCTIONS
//endregion CONSTANTS
