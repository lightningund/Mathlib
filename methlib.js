/*
* Original Author: Ben Love
* Last Editor: Ben Love
* Last Edited: 08/12/19
* Purpose: To store any and all helper functions you could need
* See the README for styling rules
*/

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

//Color
const Color = class Color {
	constructor(r, g, b, a){
		this.r, this.g, this.b, this.a;
		if(arguments.length == 0){
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.a = 255;
		} else if(arguments.length == 1){
			this.r = r;
			this.g = r;
			this.b = r;
			this.a = 255;
		} else if(arguments.length == 2){
			this.r = r;
			this.g = r;
			this.b = r;
			this.a = g;
		} else if(arguments.length == 3){
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = 255;
		} else if(arguments.length == 4){
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}

		this.getRGBFunc = function(){
			return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
		}
		this.getRGBHex = function(){
			let hexR = this.r.toString(16);
			if(hexR.length == 1){
				hexR.unshift(" ");
			}
			let hexG = this.g.toString(16);
			if(hexG.length == 1){
				hexG.unshift(" ");
			}
			let hexB = this.b.toString(16);
			if(hexB.length == 1){
				hexB.unshift(" ");
			}
			return "#" + hexR + hexG + hexB;
		}

		this.getRGBAFunc = function(){
			return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
		}
		this.getRGBAHex = function(){
			let hexR = this.r.toString(16);
			if(hexR.length == 1){
				hexR = "0" + hexR
			}
			let hexG = this.g.toString(16);
			if(hexG.length == 1){
				hexG = "0" + hexG
			}
			let hexB = this.b.toString(16);
			if(hexB.length == 1){
				hexB = "0" + hexB
			}
			let hexA = this.a.toString(16);
			if(hexA.length == 1){
				hexA = "0" + hexA
			}
			return "#" + hexR + hexG + hexB + hexA;
		}
	}
}

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

//Tetris Piece
const Piece = class Piece {
	constructor(parts) {
		this.p = parts;
	}
}

//Tetris Piece with all 4 rotations
const PieceF = class PieceF {
	constructor(pieceRots, color) {
		this.rot = pieceRots;
		this.col = color;
	}
}

//Honestly this was just for Tetris I don't know what purpose this serves otherwise
const Cell = class Cell {
	constructor(isOn = false, color = new Color(), prevColor = new Color()) {
		this.on = isOn;
		this.col = color;
		this.prevCol = prevColor;
	}
}

//Helper class for 2D vectors
const Vector2 = class Vector2 {
	constructor(x = 0, y = 0) {
		if(typeof x == "Vector2"){
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}

		//Add another vector to this one and return the result
		this.add = function (addend) {
			let newVec = new Vector2(this.x, this.y);
			newVec.x += addend.x;
			newVec.y += addend.y;
			return newVec;
		}

		//Subtract another vector from this one and return the result
		this.sub = function (subtrahend) {
			let newVec = new Vector2(this.x, this.y);
			newVec.x -= subtrahend.x;
			newVec.y -= subtrahend.y;
			return newVec;
		}

		//Scale this vector by a number and return the result
		this.scale = function (scalar) {
			let newVec = new Vector2(this.x, this.y);
			newVec.x *= scalar;
			newVec.y *= scalar;
			return newVec;
		}

		//Return the length of this vector according to c = sqrt(a^2 + b^2)
		this.length = function () {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		}

		//Normalize this vector (scale it so it's length is 1) and return the result
		this.normalize = function () {
			return this.scale(1 / this.length());
		}

		//Limit this vector to a rectangle defined by the lower and upper limits forming the corners and return the result
		this.limit = function (a, b) {
			let minMax = minAndMax(arguments.length + 1, a, b, new Vector2(0, 0), new Vector2(1, 1));
			return vectorLimit(this, minMax[0], minMax[1]);
		}
	}
}

//Helper class for a rectangular 2D collider
const Collider = class Collider {
	constructor(x = 0, y = 0, w = 20, h = 20, unMoving = false) {
		this.pos = new Vector2(x, y);
		this.size = new Vector2(w, h);
		this.vel = new Vector2();
		this.acc = new Vector2();
		this.center = new Vector2();

		this.checkCollision = (colliders, topCB, botCB, lftCB, rgtCB, anyHit) => {
			let called = false;
			let nextPos = new Vector2(this.pos.x + (this.vel.x / 4), this.pos.y);
			for(let col of colliders){
				if(overlap(new Collider(nextPos.x, nextPos.y, this.size.x, this.size.y), col)){
					if(this.vel.x > 0){
						console.log("HIT L");
						if(typeof lftCB != "undefined"){
							lftCB(col);
						}
						called = true;
					} else {
						console.log("HIT R");
						if(typeof rgtCB != "undefined"){
							rgtCB(col);
						}
						called = true;
					}
				}
			}
			nextPos = new Vector2(this.pos.x, this.pos.y + (this.vel.y / 4));
			for(let col of colliders){
				if(overlap(new Collider(nextPos.x, nextPos.y, this.size.x, this.size.y), col)){
					if(this.vel.y < 0){
						console.log("HIT B");
						if(typeof botCB != "undefined"){
							botCB(col);
						}
						called = true;
					} else {
						console.log("HIT T");
						if(typeof topCB != "undefined"){
							topCB(col);
						}
						called = true;
					}
				}
			}
			if(called) {
				if(typeof anyHit != "undefined"){
					anyHit();
				}
			}
		}

		this.wallLimit = function (bounds, hitGroundCallback, hitWallCallback) {
			if (isLimited(this.pos.x, bounds.x - this.size.x)) {
				this.vel.x = 0;
				if(hitWallCallback){
					hitWallCallback();
				}
			}
			if (isLimited(this.pos.y, bounds.y - this.size.y)) {
				this.vel.y = 0;
				if(hitGroundCallback){
					hitGroundCallback();
				}
			}
			this.pos = vectorLimit(this.pos, bounds.sub(this.size));
		}

		this.subUpdate = function(updates = 1){
			this.pos = this.pos.add(this.vel.scale(1 / updates));
		}

		this.update = function () {
			if(!unMoving){
				this.vel = this.vel.add(this.acc);
			}
			this.center.x = this.pos.x + (this.size.x / 2);
			this.center.y = this.pos.y + (this.size.y / 2);
		}
	}
}

//Helper class for an arbitrary button
const Button = class Button {
	constructor(onClick, x = 0, y = 0, w = 100, h = 100) {
		this.onClick = onClick;
		this.pos = new Vector2(x, y);
		this.size = new Vector2(w, h);

		this.wasClicked = function (clickPos) {
			return pointOverlap(clickPos, this)
		}
	}
}

//Helper Class for playing cards
const Card = class Card {
	constructor(suitIndex = 0, numIndex = 0) {
		this.numI = numIndex;
		this.suitI = suitIndex;
		this.num = CARDVALS[numIndex];
		this.suit = SUITS[suitIndex];
		this.flipped = false;
		this.sprite = new Image(20, 40);
		this.sprite.src = "https://javakid0826.github.io/Methlib-js/Images/" + this.suit + this.num + ".png";

		this.name = function () {
			return num + suit;
		}

		this.flip = function() {
			this.flipped = this.flipped ? false : true;
			return this;
		}
	}
}

//Helper Class for a deck of playing cards
const Deck = class Deck {
	constructor() {
		this.cards = [];

		for (let i = 0; i < SUITS.length; i++) {
			for (let j = 0; j < CARDVALS.length; j++) {
				this.cards.push(new Card(i, j));
			}
		}

		this.takeTopCard = function () {
			let top = this.cards[0]
			this.cards.splice(0, 1);
			return top;
		}

		this.takeNthCard = function (n) {
			let nth = this.cards[n]
			this.cards.splice(n);
			return nth;
		}

		this.getTopCard = function () {
			return this.cards[0];
		}

		this.getNthCard = function (n) {
			return this.cards[n];
		}

		this.addCard = function (newCard) {
			this.cards.push(newCard);
		}

		this.addCards = function (newCards) {
			this.cards.push(...newCards);
		}

		this.shuffle = function () {
			this.cards = randomize(this.cards);
			return this;
		}

		this.getCards = function () {
			return this.cards;
		}

		this.setDeck = function (newCards) {
			this.cards = newCards;
		}
	}
}

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

const randomize = (inArr) => {
	let outArr = [];
	let numLoops = inArr.length;
	for (let i = 0; i < numLoops; i++) {
		let index = Math.floor(random(inArr.length));
		outArr[i] = inArr.splice(index, 1)[0];
	}
	return outArr;
}

//Turns a passed in time (in seconds) into a formatted string with days, hours, minutes, and seconds
const prettyTime = (time) => {
	let seconds = time;
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);
	let out_string = ""

	if (days == 1) {
		out_string += str(days) + "day, ";
	} else if (days > 0) {
		out_string += str(days) + " days, ";
	}

	if (hours == 1) {
		out_string += str(hours % 24) + " hour, ";
	} else if (hours > 0) {
		out_string += str(hours % 24) + " hours, ";
	}

	if (minutes == 1) {
		out_string += str(minutes % 60) + " minute, ";
	} else if (minutes > 0) {
		out_string += str(minutes % 60) + " minutes, ";
	}

	if (seconds == 1) {
		out_string += str(seconds % 60) + " second";
	} else if (seconds > 0) {
		out_string += str(seconds % 60) + " seconds";
	}

	return out_string;
}

//Return the logarithm of a number with an arbitrary base
const logb = (number, base) => {
	return (Math.log(number) / Math.log(base));
}

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

//Generate the Roman numeral equivalent of a given number
const romanNumerals = (number) => {
	let romanNum = "";
	let tenthPower = Math.ceil(logb(number, 10)) + 1;

	if (number > MRV) {
		return ("Error: Number too Large");
	} else {
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

//Return all numbers that are less than n and are coprime to it
const findCoprimesLessThan = (n) => {
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

//Return the greatest common denominator
const gcd = (a, b) => {
	let gcd = 0;
	let exit = false;

	while (!exit) {
		if (a > b) {
			a -= b;
		} else if (b > a) {
			b -= a;
		} else {
			gcd = a;
			exit = true;
		}
	}
	return gcd;
}

//Return the lowest common multiple
const lcm = (a, b) => {
	return Math.abs((a * b) / gcd(a, b));
}

//Brute force prime checker
const isPrime = (n) => {
	for (let i = 2; i < Math.sqrt(n); i++) {
		if (isPrime(i)) {
			if (gcd(i, n) != 1) {
				return false;
			}
		}
	}
	return true;
}

//More efficient use of ^ and % together by using the modulus throughout the power-ing
const modPow = (b, e, m) => {
	let modPow = 1;

	for (let i = 0; i < e; i++) {
		modPow *= b;
		modPow %= m;
	}

	return modPow;
}

//RSA encryption
const RSAEncrypt = (message, n, k) => {
	let BEM = [];
	let CA = message.split("");
	for (let i = 0; i < CA.length; i++) {
		let NC = parseInt(CA[i]);
		BEM[i] = modPow(NC, k, n);
	}
	return BEM;
}

//RSA decryption
const RSADecrypt = (ENCMess, n, j) => {
	let message = "";
	for (let i = 0; i < ENCMess.length; i++) {
		let NC = modPow(ENCMess[i], j, n);
		message += NC.toString();
	}
	return message;
}

//Extended Euclid function (???????)
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

//No idea
const eTot = (n) => {
	let numCoprimes = 0;

	for (let i = 0; i < n; i++) {
		if (gcd(i, n) == 1) {
			numCoprimes++;
		}
	}

	return numCoprimes;
}

//Return the Carmicheal function of a number
//TODO: Figure out what the fuck is happening with this and why it just doesn't work sometimes
const carmichael = (n) => {
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

//Return the minimum and maximum according to the number of arguments provided
const minAndMax = (argLength, a, b, minDef, maxDef) => {
	let min, max;

	if(argLength === 1){
		min = minDef;
		max = maxDef;
	} else if(argLength === 2){
		min = minDef;
		max = a;
	} else {
		min = a;
		max = b;
	}
	return [min, max];
}

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
const pointOverlap = (p, r) => {
	return (
		p.x > r.pos.x &&
		p.x < r.pos.x + r.size.x &&
		p.y < r.pos.y + r.size.y &&
		p.y > r.pos.y
	);
}

//Check if two rectangles overlap
const overlap = (a, b) => {
	return !(
		(a.pos.x >= b.pos.x + b.size.x) ||
		(b.pos.x >= a.pos.x + a.size.x) ||
		(a.pos.y >= b.pos.y + b.size.y) ||
		(b.pos.y >= a.pos.y + a.size.y)
	);
}

//Check if a point falls within a range
const overlap1D = (a, as, b, bs) => {
	return (a + as >= b && b + bs >= a);
}

//Convert a color in HSV format to RGB format
const HSVtoRGB = (h, s, v) => {
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

//Return a random value between the maximum and minimum value
const random = (a = 0, b = 1) => {
	let minMax = minAndMax(arguments.length + 1, a, b, 0, 1);

	return (Math.random() * (minMax[1] - minMax[0])) + minMax[0];
}
