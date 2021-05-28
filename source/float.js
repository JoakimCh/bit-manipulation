/**
 * I failed finding any way for jsdoc-to-markdown to document the `float` namespace as being part of the `bit-manipulation` module, but it is...
 * @namespace float
*/

/**
 * Create a (64-bit double precision) floating point number by setting the bits in its `exponent` and `significand` (often called the mantissa). Set the `signBit` to turn the float into a negative number. For help see this: https://en.wikipedia.org/wiki/Double-precision_floating-point_format
 * @name float.fromBits
 * @param {object} parts The object holding information about which bits in the float is set.
 * @param {number|Array.<number>} parts.exponent The exponent.
 * @param {number|bigint|Array.<number>} parts.significand The fractional part.
 * @param {boolean} parts.signBit Set it to make the float negative.
 * @returns {number} A 64-bit float.
 */
export function fromBits({signBit, exponent, significand} = {}) {
  const floatBits_asBigInt = bitmask({signBit, exponent, significand})
  const floatBits_asBuffer = new BigUint64Array([floatBits_asBigInt]).buffer
  const float = new Float64Array(floatBits_asBuffer)[0]
  if (float == Infinity) throw Error('You ruined your float, it became "Infinity"...')
  if (isNaN(float)) throw Error('You ruined your float, it became "Not a Number" (NaN)...')
  return float
}

/**
 * Convert a (64-bit double precision) floating point number into an object with information about which bits are set. The exponent and significand (often called the mantissa) are returned as arrays containing the bit positions of any set bits (as in bits that are 1).
 * @name float.toBits
 * @param {number} float
 * @returns {object} {signBit, exponent, significand}
 */
export function toBits(float) {
  const floatBits_asBigInt = new BigUint64Array(new Float64Array([float]).buffer)[0]
  let signBit, exponent = [], significand = []
  signBit = floatBits_asBigInt & (1n << 63n) ? true : false
  for (let i=52n; i<63n; i++) if (floatBits_asBigInt & (1n << i)) exponent.push(Number(i-51n))
  for (let i= 0n; i<52n; i++) if (floatBits_asBigInt & (1n << i)) significand.push(Number(i+1n))
  return {signBit, exponent, significand}
}

/**
 * Set bits (as in setting them to 1) in the float supplied. This is done using an object with information about which bits to set in the `exponent` and the `significand`. Set the `signBit` to turn the float into a negative number.
 * @name float.set
 * @param {number} float The float to manipulate.
 * @param {object} parts The object holding information about which bits to set.
 * @param {number|Array.<number>} parts.exponent The exponent.
 * @param {number|bigint|Array.<number>} parts.significand The fractional part.
 * @param {boolean} parts.signBit Set it to make the float negative.
 * @returns {number} A 64-bit float.
 */
export function set(float, {signBit, exponent, significand} = {}) {
  if (typeof arguments[1] != 'object' || arguments.length > 2) throw Error('Parameters must be: float, {[signBit], [exponent], [significand]}.')
  const bitsToSet_asBigInt = bitmask(arguments[1])
  const floatBits_asBigInt = new BigUint64Array(new Float64Array([float]).buffer)[0]
  const floatBits_asBuffer = new BigUint64Array([floatBits_asBigInt | bitsToSet_asBigInt]).buffer
  float = new Float64Array(floatBits_asBuffer)[0]
  if (float == Infinity) throw Error('You ruined your float, it\'s now "Infinity"...')
  if (isNaN(float)) throw Error('You ruined your float, it\'s now "Not a Number" (NaN)...')
  return float
}

/**
 * Clear bits (as in setting them to 0) in the float supplied. This is done using an object with information about which bits to clear in the exponent and the significand.
 * @name float.clear
 * @param {number} float The float to manipulate.
 * @param {object} parts The object holding information about which bits to clear.
 * @param {number|Array.<number>} parts.exponent The exponent.
 * @param {number|bigint|Array.<number>} parts.significand The fractional part.
 * @param {boolean} parts.signBit Clear it to make a negative float positive.
 * @returns {number} A 64-bit float.
 */
export function clear(float, {signBit, exponent, significand} = {}) {
  if (typeof arguments[1] != 'object' || arguments.length > 2) throw Error('Parameters must be: float, {[signBit], [exponent], [significand]}.')
  const bitsToClear_asBigInt = bitmask(arguments[1])
  const floatBits_asBigInt = new BigUint64Array(new Float64Array([float]).buffer)[0]
  const floatBits_asBuffer = new BigUint64Array([floatBits_asBigInt & ~bitsToClear_asBigInt]).buffer
  float = new Float64Array(floatBits_asBuffer)[0]
  if (float == Infinity) throw Error('You ruined your float, it\'s now "Infinity"...')
  if (isNaN(float)) throw Error('You ruined your float, it\'s now "Not a Number" (NaN)...')
  return float
}


function bitmask({signBit, exponent, significand} = {}) {
  if ('mantissa' in arguments[0]) throw Error('Use the synonym "significand" instead of "mantissa" please.')
  let bitmask_asBigInt = 0n
  if (signBit === true || signBit === 1) {
    bitmask_asBigInt |= 1n << 63n
  }
  if (exponent != undefined) {
    if (Array.isArray(exponent)) {
      for (let bit of exponent) {
        if (bit == 0) throw Error('The least significant bit is bit 1.')
        if (bit > 11) throw Error('The exponent is only 11 bits.')
        bitmask_asBigInt |= 1n << BigInt((bit-1)+52)
      }
    } else if (typeof exponent == 'number' || typeof exponent == 'bigint') {
      if (exponent >= 2**11) throw Error('The exponent is only 11 bits.')
      bitmask_asBigInt |= BigInt(exponent) << 52n
    } else {
      throw Error('The exponent parameter must contain a value or an array with the bits to operate on in the exponent.')
    }
  }
  if (significand != undefined) {
    if (Array.isArray(significand)) {
      for (let bit of significand) {
        if (bit == 0) throw Error('The least significant bit is bit 1.')
        if (bit > 52) throw Error('The significand is only 52 bits.')
        bitmask_asBigInt |= 1n << BigInt(bit-1)
      }
    } else if (typeof significand == 'number' || typeof significand == 'bigint') {
      if (significand >= 2**52) throw Error('The significand is only 52 bits.')
      bitmask_asBigInt |= BigInt(significand)
    } else {
      throw Error('The significand parameter must contain a value or an array with the bits to operate on in the significand.')
    }
  }
  return bitmask_asBigInt
}
