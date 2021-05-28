
import * as bm from '../source/bitManipulation.js'
const log = console.log

// Classical use of (some of) the functions in this library
let v = 0b1000_0000
v = bm.set(v, 1,2,3,4) // set these bits in v and return the result
log(bm.numberToBinary(v))
v = bm.xor(v, 0xFF) // xor v with 0xFF
log(bm.numberToBinary(v))
log(bm.isSet(v, 1)) // check if the LSB is set
log(v) // the value in base 10

log() // Wrapping a value in bm.Serial allows us to do the same operations on it in series in a more convenient way
v = bm.serial(0b1000_0000)
.set(1,2,3,4).log('bin')
.xor(0xFF).log('bin')
log(v.isSet(1))
log(v.out()) // then .out() returns the result

log() // You can go mad with that
bm.serial(0).set(1,8).xor(0xFF).and(0b1111).or(0xF0).flip(1,8).not(8).log('bin')

log() // And then debug your madness for better clarity
bm.serial(0).set(1,8).log(2).xor(0xFF).log(2).and(0b1111).log(2).or(0xF0).log(2).flip(1,8).log(2).not(8).log(2)

log() // There's lots of fun to be had
log(bm.numberToHex(bm.reverseBitOrder(0xD00D, 16), 2)) 

log() // And yes, you can set bits higher than 32
log(bm.numberToBinary(bm.set(0, 33, 53), 64))
log(bm.numberToBinary(bm.set(0n, 33, 64))) // even higher than 53 if using BitInts
// And bitwise operations works fine on them
log(bm.numberToBinary(bm.or(bm.set(0, 33, 53), 1), 64))
log(bm.numberToBinary(bm.or(bm.set(0n, 33, 64), 1)))

log() // Did you ever want to mess around with the bits in a 64-bit float? Well, now you can!
let bits = bm.float.toBits(1.23456) // returns an overview of any set bits
log(bits)
log(bm.float.fromBits(bits)) // and can be used to create a float
let float = bm.float.set(1.23456, {signBit: true}) // set the sign bit
log(float)
float = bm.float.clear(float, {signBit: true}) // clear it
log(bm.float.set(float, {significand: [51]})) // and set bit 51 in the significand / mantissa

float = bm.float.fromBits({exponent: 0b1100_0001, significand: 0xF_FFFF_FFFF_FFFF}) // you can even set bits using values
log(bm.float.toBits(float)) // check that it worked correctly
log(float) // also let's check what that float looks like

log() // There's also an educational value in learning about two's complement format
log(bm.negativeIntegerFromBits(1)) // the bits to set to 0
log(bm.negativeIntegerFromValue(0b10)) // same as this (where the MSB is the sign bit)

log() // And I'm sure that you at least once wanted to know the bit length/width of a number
log(bm.bitLength(0xFFFF_FFFF))
log(bm.bitLength(0xFFFF_FFFF_FFFF_FFFF_FFFF_FFFFn))

log('Please tell your mom and dad about this! 🙂')
