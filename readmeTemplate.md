# bit-manipulation

### Description
An [ES module](https://flaviocopes.com/es-modules) providing functions for setting and clearing bits (and doing any bitwise operations) in Numbers up to 53 bits and in BigInts of any bit-width. In addition there's also functions to manipulate the bits in JavaScript's 64-bit floats and representing integers (in two's complement format) in binary or hex. It also has functions to check if any bits are set or not.

If you're new to JavaScript it might sound strange to have a library for doing bitwise operations since JavaScript has operators for this [inbuilt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#bitwise_operators) in the language. But the problem is that the inbuilt operators converts any operands into 32-bit signed integers, hence they can't return a result that is over 32 bits AND they treat bit 32 as the sign bit (although [`>>> 0`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift) can be used to get an unsigned result).

### Funding

If you find this useful then please consider helping me out (I'm jobless and sick). For more information visit my [GitHub profile](https://github.com/JoakimCh).

### How to use

#### Install using [NPM](https://www.npmjs.com/)

```shell
npm i bit-manipulation
```

#### Import the ES module into Node.js

```js
import * as bm from 'bit-manipulation'
```
Got problems using ES modules? [This might help](https://stackoverflow.com/questions/45854169/how-can-i-use-an-es6-import-in-node-js/56350495#56350495) or [read the documentation](https://nodejs.org/api/esm.html).

#### Import the ES module into the browser or Deno

```js
import * as bm from '/node_modules/bit-manipulation/source/bitManipulation.js'
```

### Example

```js
import * as bm from 'bit-manipulation'
const log = console.log // yes, this is handy

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

log() // And yes, you can set bits higher than bit 32
log(bm.numberToBinary(bm.set(0, 33, 53), 64))
log(bm.numberToBinary(bm.set(0n, 33, 64))) // even higher than bit 53 if using BigInts
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
// you can even set bits using values
float = bm.float.fromBits({exponent: 0b1100_0001, significand: 0xF_FFFF_FFFF_FFFF})
log(bm.float.toBits(float)) // check that it worked correctly
log(float) // also let's check what that float looks like

log() // There's also an educational value in learning about two's complement format
log(bm.negativeIntegerFromBits(1)) // the bits to set to 0
log(bm.negativeIntegerFromValue(0b10)) // same as this (where the MSB is the sign bit)

log() // And I'm sure that you at least once wanted to know the bit length/width of a number
log(bm.bitLength(0xFFFF_FFFF))
log(bm.bitLength(0xFFFF_FFFF_FFFF_FFFF_FFFF_FFFFn))

log('Please tell your mom and dad about this! 🙂')
```

#### Console output from example (for those without a computer):

```
0b10001111
0b01110000
false
112

0b10001111
0b01110000
false
112

0b10000000

0b10000001
0b01111110
0b00001110
0b11111110
0b01111111
0b10000000

0xB00B

0b00000000_00010000_00000000_00000001_00000000_00000000_00000000_00000000
0b10000000_00000000_00000000_00000001_00000000_00000000_00000000_00000000n
0b00000000_00010000_00000000_00000001_00000000_00000000_00000000_00000001
0b10000000_00000000_00000000_00000001_00000000_00000000_00000000_00000001n

{
  signBit: false,
  exponent: [
    1, 2, 3, 4,  5,
    6, 7, 8, 9, 10
  ],
  significand: [
     4,  5,  6, 10, 13, 14, 17, 18,
    19, 20, 24, 27, 28, 29, 30, 31,
    32, 33, 39, 40, 47, 48, 49, 50
  ]
}
1.23456
-1.23456
1.48456
{
  signBit: false,
  exponent: [ 1, 7, 8 ],
  significand: [
     1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
    34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, 52
  ]
}
2.793402995719818e-250

-2
-2

32
96
```

# Auto-generated API documentation (from JSDoc)

{{>main}}

### End of readme
```
Death is not the end of your consciousness, it's the expansion of it.
```
