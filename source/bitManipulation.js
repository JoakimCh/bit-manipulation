/**
 * @module bit-manipulation
 * @typicalname bm
 */

import {numberToBinary, numberToHex} from './extra.js'
export {numberToBinary, numberToHex}// from './extra.js'
export * as float from './float.js'

const MAX_SAFE_INTEGERn = BigInt(Number.MAX_SAFE_INTEGER)
const MIN_SAFE_INTEGERn = BigInt(Number.MIN_SAFE_INTEGER)

/**
 * Set (as in setting them to 1) these bits in the value (others retain their state).
 * @param {number|bigint} value The value to operate on.
 * @param  {...number} bits Which bits to set, where 1 means the least significant bit.
 * @returns {number|bigint}
 */
 export function set(value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let result
  const mask = bitmask(...bits)
  if (isBigInt 
  || typeof mask == 'bigint'
  || isNegative || valueBitWidth > 32) {
    result = BigInt(value) | BigInt(mask)
    result = isBigInt ? result : bigIntToNumber(result)
  } else result = (value | mask) >>> 0
  if (!isBigInt && !Number.isSafeInteger(result)) throw Error('The result of this operation is a number that fails Number.isSafeInteger(), operate on a BigInt instead if you do not want to have this limit.')
  return result
}

/**
 * Clear (as in setting them to 0) these bits in the value (others retain their state).
 * @param {number|bigint} value The value to operate on.
 * @param  {...number} bits Which bits to clear, where 1 means the least significant bit.
 * @returns {number|bigint}
 */
export function clear (value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let result
  const mask = bitmask(...bits)
  if (isBigInt || typeof mask == 'bigint'
  || isNegative || valueBitWidth > 32) {
    result = BigInt(value) & ~BigInt(mask)
    result = isBigInt ? result : bigIntToNumber(result)
  } else result = (value & ~mask) >>> 0
  if (!isBigInt && !Number.isSafeInteger(result)) throw Error('The result of this operation is a number that fails Number.isSafeInteger(), operate on a BigInt instead if you do not want to have this limit.')
  return result
}

/**
 * Flip (or toggle) these bits in the value (others retain their state).
 * @param {number|bigint} value The value to operate on.
 * @param  {...number} bits Which bits to flip, where 1 means the least significant bit.
 * @returns {number|bigint}
 */
export function flip (value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let result
  const mask = bitmask(...bits)
  if (isBigInt 
  || typeof mask == 'bigint'
  || isNegative || valueBitWidth > 32) {
    result = BigInt(value) ^ BigInt(mask)
    result = isBigInt ? result : bigIntToNumber(result)
  } else result = (value ^ mask) >>> 0
  if (!isBigInt && !Number.isSafeInteger(result)) throw Error('The result of this operation is a number that fails Number.isSafeInteger(), operate on a BigInt instead if you do not want to have this limit.')
  return result
}

/**
 * Check if any of these bits are set (as in having a state of 1) in the value.
 * @param {number|bigint} value The value to check.
 * @param  {...number} bits Which bits to check.
 * @returns {boolean} True or false
 */
export function isAnySet(value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  const mask = bitmask(...bits)
  if (isBigInt 
  || typeof mask == 'bigint'
  || valueBitWidth > 32) {
    return Boolean(BigInt(value) & BigInt(mask))
  }
  return Boolean((value & mask) >>> 0)
}

/**
 * Check if all of these bits are set (as in having a state of 1) in the value.
 * @param {number|bigint} value The value to check.
 * @param  {...number} bits Which bits to check.
 * @returns {boolean} True or false
 */
export function isSet (value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let mask = bitmask(...bits)
  if (isBigInt 
  || typeof mask == 'bigint'
  || valueBitWidth > 32) {
    mask = BigInt(mask)
    return (BigInt(value) & mask) == mask
  }
  return ((value & mask) >>> 0) == mask
}

/**
 * Check if all of these bits are not set (as in having a state of 0) in the value.
 * @param {number|bigint} value The value to check.
 * @param  {...number} bits Which bits to check.
 * @returns {boolean} True or false
 */
export function isNotSet (value, ...bits) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let mask = bitmask(...bits)
  if (isBigInt 
  || typeof mask == 'bigint'
  || valueBitWidth > 32) {
    return !(BigInt(value) & BigInt(mask))
  }
  return !((value & mask) >>> 0)
}

/**
 * Shift the bits in the value towards the left (the most significant side) `offset` amount of bits. Bits shifted in from the right will be set to 0.
 * @param {number|bigint} value The value to operate on.
 * @param {number} offset How far to shift the bits.
 * @returns {number|bigint} The result.
 */
 export function lShift(value, offset=1) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let result
  if (isBigInt || isNegative || valueBitWidth + offset > 32) {
    result = BigInt(value) << BigInt(offset)
    result = isBigInt ? result : bigIntToNumber(result)
  } else result = (value << offset) >>> 0
  return result
}

/**
 * Shift the bits in the value towards the right (the least significant side) `offset` amount of bits. Bits shifted in from the left will be set to 0.
 * @param {number|bigint} value The value to operate on.
 * @param {number} offset How far to shift the bits.
 * @returns {number|bigint} The result.
 */
export function rShift(value, offset) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  let result
  if (isBigInt || isNegative) {
    result = BigInt(value) >> BigInt(offset)
    result = isBigInt ? result : bigIntToNumber(result)
  } else result = value >>> offset
  return result
}

/*
With "xor, or, not, and" doing the operation on a BigInt will ensure correct values with negative (or mixed) numbers and numbers with bit 32 set. Hence I gave up trying to optimize them with any non-bigint operations...
*/

/**
 * Bitwise XOR (exclusive or) `value1` with `value2` and return the result.
 * @param {number|bigint} value1 
 * @param {number|bigint} value2 
 * @returns {number|bigint}
 */
export function xor(value1, value2) {
  checkSafeInteger(value1)
  checkSafeInteger(value2)
  const result = BigInt(value1) ^ BigInt(value2)
  if (typeof value1 == 'bigint'
  ||  typeof value2 == 'bigint') {
    return result
  }
  return bigIntToNumber(result)
}

/**
 * Bitwise OR `value1` with `value2` and return the result.
 * @param {number|bigint} value1 
 * @param {number|bigint} value2 
 * @returns {number|bigint}
 */
export function or(value1, value2) {
  checkSafeInteger(value1)
  checkSafeInteger(value2)
  const result = BigInt(value1) | BigInt(value2)
  if (typeof value1 == 'bigint'
  ||  typeof value2 == 'bigint') {
    return result
  }
  return bigIntToNumber(result)
}

/**
 * Bitwise AND `value1` with `value2` and return the result.
 * @param {number|bigint} value1 
 * @param {number|bigint} value2 
 * @returns {number|bigint}
 */
export function and(value1, value2) {
  checkSafeInteger(value1)
  checkSafeInteger(value2)
  const result = BigInt(value1) & BigInt(value2)
  if (typeof value1 == 'bigint'
  ||  typeof value2 == 'bigint') {
    return result
  }
  return bigIntToNumber(result)
}

/**
 * Bitwise NOT `value` (invert the bits) and return the result. If not specifying a bitLength to operate within then inverting the bits using `not` will turn any positive number into a negative one because the sign bit (which is virtual when using this library by the way) will be inverted as well.
 * @param {number|bigint} value The value to operate on.
 * @param {number} [bitLength] The bit length to operate within, set it to restrict the NOT operation to only the first `bitLength` bits of the value. Then you can not in any way invert the sign bit.
 * @returns {number|bigint} The result.
 */
export function not(value, bitLength) {
  checkSafeInteger(value)
  let result
  if (typeof bitLength == 'undefined') {
    result = ~BigInt(value)
  } else {
    result = BigInt(value) ^ BigInt(bitmask_allSet(bitLength))
  }
  return typeof value == 'bigint' ? result : bigIntToNumber(result)
}

/**
 * Reverse the bit order of the value up to the `bitLength` supplied, the returned value will be capped to this size.
 * @param {number|bigint} value The value to operate on.
 * @param {number} bitLength The wanted bit length of the returned value (the position of the most significant bit).
 * @returns {number|bigint} The result.
 */
 export function reverseBitOrder(value, bitLength) {
  const [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  if (typeof bitLength != 'number') {
    bitLength = valueBitWidth || value.toString(2).length
  }
  let result
  if (isBigInt || isNegative || bitLength > 32) {
    result = (isNegative ? BigInt(value) : 0n) // if negative then operate on that value, else clear it
    value = BigInt(value), bitLength = BigInt(bitLength)
    for (let i=0n; i<bitLength; i++) {
      const bit = value >> i & 1n // value of original bit
      if (bit == 0) {
        if (isNegative) result &= ~(1n << bitLength-1n-i) // clear the bit
      } else {
        result |= 1n << bitLength-1n-i // set the bit
      }
    }
    result = isBigInt ? result : bigIntToNumber(result)
  } else {
    result = 0
    for (let i=0; i<bitLength; i++) {
      result |= (value >> i & 1) << bitLength-1-i
    }
    result >>>= 0
  }
  return result
}

/**
 * Returns the number of bits needed to be able to represent the value. For negative numbers this does not include the sign bit.
 * @param {number|bigint} value The value to measure the length in bits of.
 * @returns {number} The bit length of the value.
 */
export function bitLength(value) {
  if (typeof value == 'number') {
    if (!Number.isSafeInteger(value)) throw Error('The number failed Number.isSafeInteger(), do not pass a float and use BigInt for huge numbers.')
    return Math.ceil(Math.log2(Math.abs(value)+1))
  }
  return value.toString(2).length
}

/**
 * Create a bitmask (which is a value with bits in these positions set). If setting bits over bit 32 then it returns a BigInt.
 * @param  {...number} bits The bit positions of any set (as in 1) bits.
 * @returns {number|bigint}
 */
 export function bitmask(...bits) {
  if (bits.length == 0) throw Error('You forgot to specify which bits...')
  let mask = 0, bigint
  for (let bit of bits) {
    if (bit == 0) throw Error('There is no "bit 0", the least significant bit has an ID of 1.')
    if (!bigint && bit > 32) {
      bigint = true
      mask = BigInt(mask >>> 0)
    }
    if (bigint) {
      mask |= 1n << BigInt(bit-1)
    } else {
      mask |= 1 << (bit-1)
    }
  }
  return bigint ? mask : mask >>> 0
}

/**
 * Create a bitmask with a length of `numBits` where all the bits are set, if `numBits` is more than 53 then a `BigInt` will be returned.
 * @param {number} numBits Defines how wide (in bits) the bitmask is.
 * @returns {number|bigint} The bitmask.
 * @example bitmask_allSet(32) == 0xFFFF_FFFF
 */
export function bitmask_allSet(numBits) {
  if (numBits <= 53) return 2**numBits - 1
  return 2n**BigInt(numBits) - 1n
}

/**
 * Create a positive integer with only these bits set. If setting bits over bit 53 (> `Number.MAX_SAFE_INTEGER`) then a BigInt is returned.
 * @param  {...number} bits Which bits to set, where 1 means the least significant bit.
 * @returns {number|bigint}
 */
export function integerFromBits(...bits) {
  return bitmask(...bits)
}

/** 
 * Create a negative integer (two's complement) from which bit positions should be set to 0.
 * @param  {...number} bits Which bits to set to 0, where 1 means the least significant bit.
 * @returns {number|bigint}
 */
export function negativeIntegerFromBits(...bits) {
  return negativeIntegerFromValue(~bitmask(...bits))
}

/** Create a negative integer (two's complement) from the bits in a value. One use case could be that you read the bits into an unsigned integer, but you actually wanted those bits to be represented as a negative number. Or educational use. 
 * @param {number|bigint} value The value with bits representing a negative number in two's complement format.
 * @returns {number|bigint}
*/
export function negativeIntegerFromValue(value) {
  let [valueBitWidth, isNegative, isBigInt] = checkSafeInteger(value)
  if (isBigInt) valueBitWidth = value.toString(2).length
  if (!isBigInt && valueBitWidth > 32) value = BigInt(value)
  const one = (isBigInt || valueBitWidth > 32 ? 1n : 1)
  let i = (isBigInt || valueBitWidth > 32 ? 0n : 0)
  let result = -one
  for (; i<valueBitWidth; i++) {
    const bit = (value >> i) & one
    if (bit == 0) result &= ~(one << i) // clear the bit
  }
  if (!isBigInt && valueBitWidth > 32) return bigIntToNumber(result)
  return result
}

/**
 * A class allowing multiple bitwise operations done in serial order on a value (for convenience). Call `out()` to return the result when done. This class actually has most of the functions in this library as its methods.
 */
export class Serial {
  /**
   * @param {number|bigint} value Enter the value to operate on, must be an integer.
   */
  constructor(value) {
    checkSafeInteger(value)
    this.value = value
  }

  /**
   * Manipulate or read the value using your own function, return nothing if no change is to be made or return the new value.
   * @param {function} func A function which will receive the value.
   */
  x(func) {
    this.value = func(this.value) ?? this.value
    return this
  }

  /** Returns the value operated on.
   * @param {number|string} [base] The base to use. Defaults to base 10, also supports base 2 and 16.
  */
  out(base) {
    switch (base) {
      default:
        return this.value
      case 2: case 'bin': case 'binary':
        return numberToBinary(this.value)
      case 16: case 'hex': case 'hexadecimal':
        return numberToHex(this.value)
    }
  }

  /** A shortcut to logging the value using `console.log`. But with options for using a binary or hexadecimal representation.
   * @param {number|string} [base] The base to use. Defaults to base 10, also supports base 2 and 16.
   */
  log(base) {
    console.log(this.out(base))
    return this
  }
  
  /**
   * Bitwise NOT (invert the bits). If not specifying a `bitLength` to operate within then inverting the bits using `not` will turn any positive number into a negative one because the sign bit (which is virtual when using this library by the way) will be inverted as well.
   * @param {number} bitLength
   */
  not(bitLength) {this.value = not(this.value, bitLength); return this}

  /**
   * Reverse the bit order up to the `bitLength` supplied, the result will be capped to this size.
   * @param {number} bitLength The wanted bit length of the result (the position of the most significant bit).
   */
  reverseBitOrder(bitLength) {
    this.value = reverseBitOrder(this.value, bitLength)
    return this
  }

  /**
   * Shift the bits towards the right (the least significant side) `offset` amount of bits. Bits shifted in from the left will be set to 0.
   * @param {number} offset How far to shift the bits.
   */
  rShift(offset) {this.value = rShift(this.value, offset); return this}
  /**
   * Shift the bits towards the left (the most significant side) `offset` amount of bits. Bits shifted in from the right will be set to 0.
   * @param {number} offset How far to shift the bits.
   */
  lShift(offset) {this.value = lShift(this.value, offset); return this}

  /** Bitwise AND */
  and(value) {this.value = and(this.value, value); return this}
  /** Bitwise OR */
  or(value) {this.value = or(this.value, value); return this}
  /** Bitwise XOR */
  xor(value) {this.value = xor(this.value, value); return this}

  /**
   * Set (as in setting them to 1) these bits (others retain their state).
   * @param  {...number} bits Which bits to set, where 1 means the least significant bit.
   */
  set(...bits) {this.value = set(this.value, ...bits); return this}
  /**
   * Clear (as in setting them to 0) these bits (others retain their state).
   * @param  {...number} bits Which bits to clear, where 1 means the least significant bit.
   */
  clear(...bits) {this.value = clear(this.value, ...bits); return this}
  /**
   * Flip (or toggle) these bits (others retain their state).
   * @param  {...number} bits Which bits to flip, where 1 means the least significant bit.
   */
  flip(...bits) {this.value = flip(this.value, ...bits); return this}

  /**
   * Check if all of these bits are set (as in having a state of 1).
   * @param  {...number} bits Which bits to check.
   * @returns {boolean} True or false
   */
  isSet(...bits) {return isSet(this.value, ...bits)}
  /**
   * Check if any of these bits are set (as in having a state of 1).
   * @param  {...number} bits Which bits to check.
   * @returns {boolean} True or false
   */
  isAnySet(...bits) {return isAnySet(this.value, ...bits)}
  /**
   * Check if all of these bits are not set (as in having a state of 0).
   * @param  {...number} bits Which bits to check.
   * @returns {boolean} True or false
   */
  isNotSet(...bits) {return isNotSet(this.value, ...bits)}
  /**
   * Returns the number of bits needed to be able to represent the value. For negative numbers this does not include the sign bit.
   * @returns {number} The bit length of the value.
   */
  bitLength() {return bitLength(this.value)}
}

/**
 * If you want to do multiple bitwise operations (in serial order) then this will wrap the value in a class which has most of the functions in this library as its methods. Call `out()` to return the result when done.
 * @example serial(value).rShift(32).and(0xFFFF_FFFF).out()
 * @param {number|bigint} value 
 * @returns {Serial}
 */
export function serial(value) {
  return new Serial(value)
}

/* Used internally when we want to return a Number from a BigInt. */
const bigIntToNumber = bigInt => {
  if (bigInt < MIN_SAFE_INTEGERn) throw Error('The result of this bit operation is a number less than the MIN_SAFE_INTEGER. To circumvent this do the operation on a BigInt instead.')
  if (bigInt > MAX_SAFE_INTEGERn) throw Error('The result of this bit operation is a number larger than the MAX_SAFE_INTEGER. To circumvent this do the operation on a BigInt instead.')
  return Number(bigInt)
}

/* Used internally, returns [bitWidth (if not BigInt), isNegative, isBigInt] and checks that the value is within "safe integer" or is a BigInt. */
const checkSafeInteger = value => {
  if (typeof value == 'undefined') throw Error('The value to operate on is undefined.')
  const isBigInt = typeof value == 'bigint'
  if (!isBigInt) {
    if (!Number.isSafeInteger(value)) throw Error('Can\'t do bit operations on numbers failing Number.isSafeInteger(), pass a BigInt if you want to do this.')
    return [Math.ceil(Math.log2(Math.abs(value)+1)), value < 0, isBigInt]
  }
  return [0, value < 0, isBigInt]
}
