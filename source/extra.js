/**
 * @module bit-manipulation
 * @ignore
 */

/**
 * Converts any `Number` or `BigInt` into a hexadecimal representation.
 * 
 * Numbers with a fractional part will represented in the IEEE 754 double-precision binary format. Where the first bit is the sign bit, followed by the exponent (11 bits) and the significand / mantissa (52 bits).
 * 
 * Other numbers (integers) will be represented in the two's complement format. Where negative numbers are actually displayed correctly compared to when using `(number).toString(16)`.
 * @param {number} number The number to convert to hex.
 * @param {number} [paddingByteSize=4] How many bytes to align the output with.
 * @param {number} [grouping=4] Group the output into chunks of this size.
 * @param {boolean} [showPrefix=true] Whether to prefix the output with 0x or not.
 * @returns {string} The hexadecimal representation.
 */
export function numberToHex(number, paddingByteSize = 4, grouping = 4, showPrefix = true) {
  let paddingBits = paddingByteSize * 8
  const isBigInt = typeof number == 'bigint'
  const isNegative = isBigInt ? number < 0n : number < 0
  const hasFraction = isBigInt ? false : number !== Math.trunc(number)
  let binary
  if (hasFraction) {
    binary = float64toHex(number)
  } else {
    if (isNegative) {
      const numberBitLength = number.toString(2).length
      const overflow = numberBitLength > paddingBits ? numberBitLength % paddingBits : 0
      if (overflow) paddingBits = numberBitLength + (paddingBits - overflow)
      const mask = 2n**BigInt(numberBitLength > paddingBits ? numberBitLength : paddingBits) - 1n
      binary = (BigInt(number) & mask).toString(16).toUpperCase()
    } else {
      binary = number.toString(16).toUpperCase()
    }
  }
  return (showPrefix ? '0x' : '') + padAndGroup(binary, '0', paddingByteSize*2, '_', grouping) + (isBigInt && showPrefix ? 'n' : '')
}

/**
 * Converts any `Number` or `BigInt` into a binary representation.
 * 
 * Numbers with a fractional part will represented in the IEEE 754 double-precision binary format. Where the first bit is the sign bit, followed by the exponent (11 bits) and the significand / mantissa (52 bits).
 * 
 * Other numbers (integers) will be represented in the two's complement format. Where negative numbers are actually displayed correctly compared to when using `(number).toString(2)`.
 * @param {number} number The number to convert to binary.
 * @param {number} [paddingBits=8] How many bits to align the output with.
 * @param {number} [grouping=4] Group the output into chunks of this size.
 * @param {boolean} [showPrefix=true] Whether to prefix the output with 0b or not.
 * @returns {string} The binary representation.
 */
export function numberToBinary(number, paddingBits = 8, grouping = 8, showPrefix = true) {
  const isBigInt = typeof number == 'bigint'
  const isNegative = isBigInt ? number < 0n : number < 0
  const hasFraction = isBigInt ? false : number !== Math.trunc(number)
  let binary
  if (hasFraction) {
    binary = float64toBinary(number)
  } else {
    if (isNegative) {
      const numberBitLength = number.toString(2).length
      const overflow = numberBitLength > paddingBits ? numberBitLength % paddingBits : 0
      if (overflow) paddingBits = numberBitLength + (paddingBits - overflow)
      const mask = 2n**BigInt(numberBitLength > paddingBits ? numberBitLength : paddingBits) - 1n
      binary = (BigInt(number) & mask).toString(2)
    } else {
      binary = number.toString(2)
    }
  }
  return (showPrefix ? '0b' : '') + padAndGroup(binary, '0', paddingBits, '_', grouping) + (isBigInt && showPrefix ? 'n' : '')
}

function padAndGroup(string, padChar, padSize, groupChar, groupSize) {
  // if (string.length < padSize) string = padChar.repeat(padSize - string.length) + string
  const overflow = string.length > padSize ? string.length % padSize : 0
  if (overflow) padSize = string.length + (padSize - overflow)
  if (padSize > string.length) string = padChar.repeat(padSize - string.length) + string
  if (groupSize) {
    let result = ''
    if (string.length % groupSize) result += string.slice(0, string.length % groupSize) + groupChar
    for (let i=string.length % groupSize; i<string.length; i+=groupSize) {
      result += string.slice(i, i+groupSize) + groupChar
    }
    string = result.slice(0, -1)
  }
  return string
}

function float64toBinary(float) {
  const binary = new BigUint64Array(new Float64Array([float]).buffer)[0].toString(2)
  return '0'.repeat(64 - binary.length) + binary
}
function float64toHex(float) {
  const hex = new BigUint64Array(new Float64Array([float]).buffer)[0].toString(16)
  return '0'.repeat(16 - hex.length) + hex
}
