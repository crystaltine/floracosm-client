/**
 * For example, if a one square is given as {1, 1, 4} then it includes all in between and including (1, 1) to (4, -2)
 * @param {Object} pos1 {x, y, size} x, y should be top left corner. Size is num of tiles in sidelen
 * @param {Object} pos2 Same as above
 * @returns {boolean} True if the two squares defined overlap (touching doesnt count), else false.
 */
export function squaresOverlap(pos1, pos2) {

    const res = !(pos1.x > pos2.x + pos2.size - 1 ||
        pos1.x + pos1.size - 1 < pos2.x ||
        pos1.y > pos2.y + pos2.size - 1 ||
        pos1.y + pos1.size - 1 < pos2.y)

    //console.log(`Overlap result for pos1 ${JSON.stringify(pos1)} and pos2 ${JSON.stringify(pos2)}: ${res}`)
    return res;
}

/**
 * For example, if a one square is given as {1, 1, 4} then it includes all in between and including (1, 1) to (4, -2)
 * Canvas size is always odd, 0,0 is top left
 * @param {Object} pos {x, y, size} x, y should be top left corner of square. Size is num of tiles in sidelen
 * @param {Number} canvasSize 
 * @returns {boolean} True if the square is out of bounds (touching edge doesnt count), else false.
 */
export function squareOutOfBounds(pos, canvasSize) {
    const res = (pos.x < 0 || pos.y < 0 ||
        pos.x + pos.size - 1 >= canvasSize ||
        pos.y + pos.size - 1 >= canvasSize)

    //console.log(`OOB result for pos ${JSON.stringify(pos)} and canvasSize ${canvasSize}: ${res}`)
    return res;
}

/**
 * Convert center-based coords to top-left-based. canvasSize is assumed to be odd.
 * Example: 0, 0, 21 -> 10, 10
 * @returns {Array} [x, y]
 */
export function convertToTopLeftCoords(x, y, canvasSize) {
    const half = (canvasSize - 1) / 2;
    return [x + half, y + half];
}

/**
 * Convert top-left-based coords to center-based. canvasSize is assumed to be odd.
 * @returns {Array} [x, y]
 */
export function convertToCenterCoords(x, y, canvasSize) {
    const half = (canvasSize - 1) / 2;
    return [x - half, y - half];
}

/**
 * MUST BE CONSISTENT WITH SERVER SIDE!
 * @param {Number} amount amount donated in dollars
 * @returns {Number} size of a thumbnail in units of 100px, 1-10x based on amount
 */
export function getSizeByAmount(amount) {
    if (isNaN(amount) || amount <= 0) return 0;
	if (amount < 10) return 1;
	if (amount < 50) return 2;
	if (amount < 100) return 3;
	if (amount < 500) return 4;
	if (amount < 1000) return 5;
	if (amount < 5000) return 6;
	if (amount < 10000) return 7;
	if (amount < 50000) return 8;
	if (amount < 100000) return 9;
	return 10;
}

export function isDevEnv() {

    let data;
    
    try {
        data = require('./.env.json');
    } catch (e) {
        return false;
    }

    return data.ENVTYPE === 'dev';
}

/**
 * Returns a string for the requested dev API fetch URL
 * @param {Boolean} dev true for dev (localhost server), false for prod (azure server)
 * @param {String} endpoint e.g. /login (must start with /)
 * @param {Object} queryParams e.g. {email: "abc", password: "def"}
 * @returns {String} e.g. http://localhost:3999/login?email=abc&password=def
 */
export function API(dev = true, endpoint = "", queryParams = {}) {

    let str = dev?
    `http://localhost:3999${endpoint}` :
    `https://floracosm-server.azurewebsites.net${endpoint}`;

    if (Object.keys(queryParams).length > 0) str += "?";

    for (const [key, value] of Object.entries(queryParams)) {
        str += `&${key}=${value}`
    }

    return str;
}