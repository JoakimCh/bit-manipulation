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

## Modules

<dl>
<dt><a href="#module_bit-manipulation">bit-manipulation</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#float">float</a> : <code>object</code></dt>
<dd><p>I failed finding any way for jsdoc-to-markdown to document the <code>float</code> namespace as being part of the <code>bit-manipulation</code> module, but it is...</p>
</dd>
</dl>

<a name="module_bit-manipulation"></a>

## bit-manipulation

* [bit-manipulation](#module_bit-manipulation)
    * [.Serial](#module_bit-manipulation.Serial)
        * [new exports.Serial(value)](#new_module_bit-manipulation.Serial_new)
        * [.x(func)](#module_bit-manipulation.Serial+x)
        * [.out([base])](#module_bit-manipulation.Serial+out)
        * [.log([base])](#module_bit-manipulation.Serial+log)
        * [.not(bitLength)](#module_bit-manipulation.Serial+not)
        * [.reverseBitOrder(bitLength)](#module_bit-manipulation.Serial+reverseBitOrder)
        * [.rShift(offset)](#module_bit-manipulation.Serial+rShift)
        * [.lShift(offset)](#module_bit-manipulation.Serial+lShift)
        * [.and()](#module_bit-manipulation.Serial+and)
        * [.or()](#module_bit-manipulation.Serial+or)
        * [.xor()](#module_bit-manipulation.Serial+xor)
        * [.set(...bits)](#module_bit-manipulation.Serial+set)
        * [.clear(...bits)](#module_bit-manipulation.Serial+clear)
        * [.flip(...bits)](#module_bit-manipulation.Serial+flip)
        * [.isSet(...bits)](#module_bit-manipulation.Serial+isSet) ⇒ <code>boolean</code>
        * [.isAnySet(...bits)](#module_bit-manipulation.Serial+isAnySet) ⇒ <code>boolean</code>
        * [.isNotSet(...bits)](#module_bit-manipulation.Serial+isNotSet) ⇒ <code>boolean</code>
        * [.bitLength()](#module_bit-manipulation.Serial+bitLength) ⇒ <code>number</code>
    * [.set(value, ...bits)](#module_bit-manipulation.set) ⇒ <code>number</code> \| <code>bigint</code>
    * [.clear(value, ...bits)](#module_bit-manipulation.clear) ⇒ <code>number</code> \| <code>bigint</code>
    * [.flip(value, ...bits)](#module_bit-manipulation.flip) ⇒ <code>number</code> \| <code>bigint</code>
    * [.isAnySet(value, ...bits)](#module_bit-manipulation.isAnySet) ⇒ <code>boolean</code>
    * [.isSet(value, ...bits)](#module_bit-manipulation.isSet) ⇒ <code>boolean</code>
    * [.isNotSet(value, ...bits)](#module_bit-manipulation.isNotSet) ⇒ <code>boolean</code>
    * [.lShift(value, offset)](#module_bit-manipulation.lShift) ⇒ <code>number</code> \| <code>bigint</code>
    * [.rShift(value, offset)](#module_bit-manipulation.rShift) ⇒ <code>number</code> \| <code>bigint</code>
    * [.xor(value1, value2)](#module_bit-manipulation.xor) ⇒ <code>number</code> \| <code>bigint</code>
    * [.or(value1, value2)](#module_bit-manipulation.or) ⇒ <code>number</code> \| <code>bigint</code>
    * [.and(value1, value2)](#module_bit-manipulation.and) ⇒ <code>number</code> \| <code>bigint</code>
    * [.not(value, [bitLength])](#module_bit-manipulation.not) ⇒ <code>number</code> \| <code>bigint</code>
    * [.reverseBitOrder(value, bitLength)](#module_bit-manipulation.reverseBitOrder) ⇒ <code>number</code> \| <code>bigint</code>
    * [.bitLength(value)](#module_bit-manipulation.bitLength) ⇒ <code>number</code>
    * [.bitmask(...bits)](#module_bit-manipulation.bitmask) ⇒ <code>number</code> \| <code>bigint</code>
    * [.bitmask_allSet(numBits)](#module_bit-manipulation.bitmask_allSet) ⇒ <code>number</code> \| <code>bigint</code>
    * [.integerFromBits(...bits)](#module_bit-manipulation.integerFromBits) ⇒ <code>number</code> \| <code>bigint</code>
    * [.negativeIntegerFromBits()](#module_bit-manipulation.negativeIntegerFromBits)
    * [.negativeIntegerFromValue(value)](#module_bit-manipulation.negativeIntegerFromValue) ⇒ <code>number</code> \| <code>bigint</code>
    * [.serial(value)](#module_bit-manipulation.serial) ⇒ <code>Serial</code>
    * [.numberToHex(number, [paddingByteSize], [grouping], [showPrefix])](#module_bit-manipulation.numberToHex) ⇒ <code>string</code>
    * [.numberToBinary(number, [paddingBits], [grouping], [showPrefix])](#module_bit-manipulation.numberToBinary) ⇒ <code>string</code>

<a name="module_bit-manipulation.Serial"></a>

### bm.Serial
A class allowing multiple bitwise operations done in serial order on a value (for convenience). Call `out()` to return the result when done. This class actually has most of the functions in this library as its methods.

**Kind**: static class of [<code>bit-manipulation</code>](#module_bit-manipulation)  

* [.Serial](#module_bit-manipulation.Serial)
    * [new exports.Serial(value)](#new_module_bit-manipulation.Serial_new)
    * [.x(func)](#module_bit-manipulation.Serial+x)
    * [.out([base])](#module_bit-manipulation.Serial+out)
    * [.log([base])](#module_bit-manipulation.Serial+log)
    * [.not(bitLength)](#module_bit-manipulation.Serial+not)
    * [.reverseBitOrder(bitLength)](#module_bit-manipulation.Serial+reverseBitOrder)
    * [.rShift(offset)](#module_bit-manipulation.Serial+rShift)
    * [.lShift(offset)](#module_bit-manipulation.Serial+lShift)
    * [.and()](#module_bit-manipulation.Serial+and)
    * [.or()](#module_bit-manipulation.Serial+or)
    * [.xor()](#module_bit-manipulation.Serial+xor)
    * [.set(...bits)](#module_bit-manipulation.Serial+set)
    * [.clear(...bits)](#module_bit-manipulation.Serial+clear)
    * [.flip(...bits)](#module_bit-manipulation.Serial+flip)
    * [.isSet(...bits)](#module_bit-manipulation.Serial+isSet) ⇒ <code>boolean</code>
    * [.isAnySet(...bits)](#module_bit-manipulation.Serial+isAnySet) ⇒ <code>boolean</code>
    * [.isNotSet(...bits)](#module_bit-manipulation.Serial+isNotSet) ⇒ <code>boolean</code>
    * [.bitLength()](#module_bit-manipulation.Serial+bitLength) ⇒ <code>number</code>

<a name="new_module_bit-manipulation.Serial_new"></a>

#### new exports.Serial(value)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | Enter the value to operate on, must be an integer. |

<a name="module_bit-manipulation.Serial+x"></a>

#### serial.x(func)
Manipulate or read the value using your own function, return nothing if no change is to be made or return the new value.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | A function which will receive the value. |

<a name="module_bit-manipulation.Serial+out"></a>

#### serial.out([base])
Returns the value operated on.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| [base] | <code>number</code> \| <code>string</code> | The base to use. Defaults to base 10, also supports base 2 and 16. |

<a name="module_bit-manipulation.Serial+log"></a>

#### serial.log([base])
A shortcut to logging the value using `console.log`. But with options for using a binary or hexadecimal representation.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| [base] | <code>number</code> \| <code>string</code> | The base to use. Defaults to base 10, also supports base 2 and 16. |

<a name="module_bit-manipulation.Serial+not"></a>

#### serial.not(bitLength)
Bitwise NOT (invert the bits). If not specifying a `bitLength` to operate within then inverting the bits using `not` will turn any positive number into a negative one because the sign bit (which is virtual when using this library by the way) will be inverted as well.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type |
| --- | --- |
| bitLength | <code>number</code> | 

<a name="module_bit-manipulation.Serial+reverseBitOrder"></a>

#### serial.reverseBitOrder(bitLength)
Reverse the bit order up to the `bitLength` supplied, the result will be capped to this size.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| bitLength | <code>number</code> | The wanted bit length of the result (the position of the most significant bit). |

<a name="module_bit-manipulation.Serial+rShift"></a>

#### serial.rShift(offset)
Shift the bits towards the right (the least significant side) `offset` amount of bits. Bits shifted in from the left will be set to 0.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | How far to shift the bits. |

<a name="module_bit-manipulation.Serial+lShift"></a>

#### serial.lShift(offset)
Shift the bits towards the left (the most significant side) `offset` amount of bits. Bits shifted in from the right will be set to 0.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | How far to shift the bits. |

<a name="module_bit-manipulation.Serial+and"></a>

#### serial.and()
Bitwise AND

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
<a name="module_bit-manipulation.Serial+or"></a>

#### serial.or()
Bitwise OR

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
<a name="module_bit-manipulation.Serial+xor"></a>

#### serial.xor()
Bitwise XOR

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
<a name="module_bit-manipulation.Serial+set"></a>

#### serial.set(...bits)
Set (as in setting them to 1) these bits (others retain their state).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to set, where 1 means the least significant bit. |

<a name="module_bit-manipulation.Serial+clear"></a>

#### serial.clear(...bits)
Clear (as in setting them to 0) these bits (others retain their state).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to clear, where 1 means the least significant bit. |

<a name="module_bit-manipulation.Serial+flip"></a>

#### serial.flip(...bits)
Flip (or toggle) these bits (others retain their state).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to flip, where 1 means the least significant bit. |

<a name="module_bit-manipulation.Serial+isSet"></a>

#### serial.isSet(...bits) ⇒ <code>boolean</code>
Check if all of these bits are set (as in having a state of 1).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.Serial+isAnySet"></a>

#### serial.isAnySet(...bits) ⇒ <code>boolean</code>
Check if any of these bits are set (as in having a state of 1).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.Serial+isNotSet"></a>

#### serial.isNotSet(...bits) ⇒ <code>boolean</code>
Check if all of these bits are not set (as in having a state of 0).

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.Serial+bitLength"></a>

#### serial.bitLength() ⇒ <code>number</code>
Returns the number of bits needed to be able to represent the value. For negative numbers this does not include the sign bit.

**Kind**: instance method of [<code>Serial</code>](#module_bit-manipulation.Serial)  
**Returns**: <code>number</code> - The bit length of the value.  
<a name="module_bit-manipulation.set"></a>

### bm.set(value, ...bits) ⇒ <code>number</code> \| <code>bigint</code>
Set (as in setting them to 1) these bits in the value (others retain their state).

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| ...bits | <code>number</code> | Which bits to set, where 1 means the least significant bit. |

<a name="module_bit-manipulation.clear"></a>

### bm.clear(value, ...bits) ⇒ <code>number</code> \| <code>bigint</code>
Clear (as in setting them to 0) these bits in the value (others retain their state).

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| ...bits | <code>number</code> | Which bits to clear, where 1 means the least significant bit. |

<a name="module_bit-manipulation.flip"></a>

### bm.flip(value, ...bits) ⇒ <code>number</code> \| <code>bigint</code>
Flip (or toggle) these bits in the value (others retain their state).

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| ...bits | <code>number</code> | Which bits to flip, where 1 means the least significant bit. |

<a name="module_bit-manipulation.isAnySet"></a>

### bm.isAnySet(value, ...bits) ⇒ <code>boolean</code>
Check if any of these bits are set (as in having a state of 1) in the value.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to check. |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.isSet"></a>

### bm.isSet(value, ...bits) ⇒ <code>boolean</code>
Check if all of these bits are set (as in having a state of 1) in the value.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to check. |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.isNotSet"></a>

### bm.isNotSet(value, ...bits) ⇒ <code>boolean</code>
Check if all of these bits are not set (as in having a state of 0) in the value.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>boolean</code> - True or false  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to check. |
| ...bits | <code>number</code> | Which bits to check. |

<a name="module_bit-manipulation.lShift"></a>

### bm.lShift(value, offset) ⇒ <code>number</code> \| <code>bigint</code>
Shift the bits in the value towards the left (the most significant side) `offset` amount of bits. Bits shifted in from the right will be set to 0.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> \| <code>bigint</code> - The result.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| offset | <code>number</code> | How far to shift the bits. |

<a name="module_bit-manipulation.rShift"></a>

### bm.rShift(value, offset) ⇒ <code>number</code> \| <code>bigint</code>
Shift the bits in the value towards the right (the least significant side) `offset` amount of bits. Bits shifted in from the left will be set to 0.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> \| <code>bigint</code> - The result.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| offset | <code>number</code> | How far to shift the bits. |

<a name="module_bit-manipulation.xor"></a>

### bm.xor(value1, value2) ⇒ <code>number</code> \| <code>bigint</code>
Bitwise XOR (exclusive or) `value1` with `value2` and return the result.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type |
| --- | --- |
| value1 | <code>number</code> \| <code>bigint</code> | 
| value2 | <code>number</code> \| <code>bigint</code> | 

<a name="module_bit-manipulation.or"></a>

### bm.or(value1, value2) ⇒ <code>number</code> \| <code>bigint</code>
Bitwise OR `value1` with `value2` and return the result.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type |
| --- | --- |
| value1 | <code>number</code> \| <code>bigint</code> | 
| value2 | <code>number</code> \| <code>bigint</code> | 

<a name="module_bit-manipulation.and"></a>

### bm.and(value1, value2) ⇒ <code>number</code> \| <code>bigint</code>
Bitwise AND `value1` with `value2` and return the result.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type |
| --- | --- |
| value1 | <code>number</code> \| <code>bigint</code> | 
| value2 | <code>number</code> \| <code>bigint</code> | 

<a name="module_bit-manipulation.not"></a>

### bm.not(value, [bitLength]) ⇒ <code>number</code> \| <code>bigint</code>
Bitwise NOT `value` (invert the bits) and return the result. If not specifying a bitLength to operate within then inverting the bits using `not` will turn any positive number into a negative one because the sign bit (which is virtual when using this library by the way) will be inverted as well.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> \| <code>bigint</code> - The result.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| [bitLength] | <code>number</code> | The bit length to operate within, set it to restrict the NOT operation to only the first `bitLength` bits of the value. Then you can not in any way invert the sign bit. |

<a name="module_bit-manipulation.reverseBitOrder"></a>

### bm.reverseBitOrder(value, bitLength) ⇒ <code>number</code> \| <code>bigint</code>
Reverse the bit order of the value up to the `bitLength` supplied, the returned value will be capped to this size.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> \| <code>bigint</code> - The result.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to operate on. |
| bitLength | <code>number</code> | The wanted bit length of the returned value (the position of the most significant bit). |

<a name="module_bit-manipulation.bitLength"></a>

### bm.bitLength(value) ⇒ <code>number</code>
Returns the number of bits needed to be able to represent the value. For negative numbers this does not include the sign bit.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> - The bit length of the value.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value to measure the length in bits of. |

<a name="module_bit-manipulation.bitmask"></a>

### bm.bitmask(...bits) ⇒ <code>number</code> \| <code>bigint</code>
Create a bitmask (which is a value with bits in these positions set). If setting bits over bit 32 then it returns a BigInt.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | The bit positions of any set (as in 1) bits. |

<a name="module_bit-manipulation.bitmask_allSet"></a>

### bm.bitmask\_allSet(numBits) ⇒ <code>number</code> \| <code>bigint</code>
Create a bitmask with a length of `numBits` where all the bits are set, if `numBits` is more than 53 then a `BigInt` will be returned.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>number</code> \| <code>bigint</code> - The bitmask.  

| Param | Type | Description |
| --- | --- | --- |
| numBits | <code>number</code> | Defines how wide (in bits) the bitmask is. |

**Example**  
```js
bitmask_allSet(32) == 0xFFFF_FFFF
```
<a name="module_bit-manipulation.integerFromBits"></a>

### bm.integerFromBits(...bits) ⇒ <code>number</code> \| <code>bigint</code>
Create a positive integer with only these bits set. If setting bits over bit 53 (> `Number.MAX_SAFE_INTEGER`) then a BigInt is returned.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| ...bits | <code>number</code> | Which bits to set, where 1 means the least significant bit. |

<a name="module_bit-manipulation.negativeIntegerFromBits"></a>

### bm.negativeIntegerFromBits()
Create a negative integer (two's complement) from which bit positions should be set to 0.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
<a name="module_bit-manipulation.negativeIntegerFromValue"></a>

### bm.negativeIntegerFromValue(value) ⇒ <code>number</code> \| <code>bigint</code>
Create a negative integer (two's complement) from the bits in a value. One use case could be that you read the bits into an usigned integer, but you actually wanted those bits to be represented as a negative number. Or educational use.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>bigint</code> | The value with bits representing a negative number in two's complement format. |

<a name="module_bit-manipulation.serial"></a>

### bm.serial(value) ⇒ <code>Serial</code>
If you want to do multiple bitwise operations (in serial order) then this will wrap the value in a class which has most of the functions in this library as its methods. Call `out()` to return the result when done.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  

| Param | Type |
| --- | --- |
| value | <code>number</code> \| <code>bigint</code> | 

**Example**  
```js
serial(value).rShift(32).and(0xFFFF_FFFF).out()
```
<a name="module_bit-manipulation.numberToHex"></a>

### bm.numberToHex(number, [paddingByteSize], [grouping], [showPrefix]) ⇒ <code>string</code>
Converts any Number or BigInt into a hexadecimal representation.

Numbers with a fractional part will represented in the IEEE 754 double-precision binary format. Where the first bit is the sign bit, followed by the exponent (11 bits) and the significand / mantissa (52 bits).

Other numbers (integers) will be represented in the two's complement format. Where negative numbers are actually displayed correctly compared to when using `(number).toString(16)`.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>string</code> - The hexadecimal representation.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | The number to convert to hex. |
| [paddingByteSize] | <code>number</code> | <code>4</code> | How many bytes to align the output with. |
| [grouping] | <code>number</code> | <code>4</code> | Group the output into chunks of this size. |
| [showPrefix] | <code>boolean</code> | <code>true</code> | Whether to prefix the output with 0x or not. |

<a name="module_bit-manipulation.numberToBinary"></a>

### bm.numberToBinary(number, [paddingBits], [grouping], [showPrefix]) ⇒ <code>string</code>
Converts any Number or BigInt into a binary representation.

Numbers with a fractional part will represented in the IEEE 754 double-precision binary format. Where the first bit is the sign bit, followed by the exponent (11 bits) and the significand / mantissa (52 bits).

Other numbers (integers) will be represented in the two's complement format. Where negative numbers are actually displayed correctly compared to when using `(number).toString(2)`.

**Kind**: static method of [<code>bit-manipulation</code>](#module_bit-manipulation)  
**Returns**: <code>string</code> - The binary representation.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| number | <code>number</code> |  | The number to convert to binary. |
| [paddingBits] | <code>number</code> | <code>8</code> | How many bits to align the output with. |
| [grouping] | <code>number</code> | <code>4</code> | Group the output into chunks of this size. |
| [showPrefix] | <code>boolean</code> | <code>true</code> | Whether to prefix the output with 0b or not. |

<a name="float"></a>

## float : <code>object</code>
I failed finding any way for jsdoc-to-markdown to document the `float` namespace as being part of the `bit-manipulation` module, but it is...

**Kind**: global namespace  

* [float](#float) : <code>object</code>
    * [.fromBits](#float.fromBits) ⇒ <code>number</code>
    * [.toBits](#float.toBits) ⇒ <code>object</code>
    * [.set](#float.set) ⇒ <code>number</code>
    * [.clear](#float.clear) ⇒ <code>number</code>

<a name="float.fromBits"></a>

### float.fromBits ⇒ <code>number</code>
Create a (64-bit double precision) floating point number by setting the bits in its `exponent` and `significand` (often called the mantissa). Set the `signBit` to turn the float into a negative number. For help see this: https://en.wikipedia.org/wiki/Double-precision_floating-point_format

**Kind**: static property of [<code>float</code>](#float)  
**Returns**: <code>number</code> - A 64-bit float.  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>object</code> | The object holding information about which bits in the float is set. |
| parts.exponent | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The exponent. |
| parts.significand | <code>number</code> \| <code>bigint</code> \| <code>Array.&lt;number&gt;</code> | The fractional part. |
| parts.signBit | <code>boolean</code> | Set it to make the float negative. |

<a name="float.toBits"></a>

### float.toBits ⇒ <code>object</code>
Convert a (64-bit double precision) floating point number into an object with information about which bits are set. The exponent and significand (often called the mantissa) are returned as arrays containing the bit positions of any set bits (as in bits that are 1).

**Kind**: static property of [<code>float</code>](#float)  
**Returns**: <code>object</code> - {signBit, exponent, significand}  

| Param | Type |
| --- | --- |
| float | <code>number</code> | 

<a name="float.set"></a>

### float.set ⇒ <code>number</code>
Set bits (as in setting them to 1) in the float supplied. This is done using an object with information about which bits to set in the exponent and the significand. Set the `signBit` to turn the float into a negative number.

**Kind**: static property of [<code>float</code>](#float)  
**Returns**: <code>number</code> - A 64-bit float.  

| Param | Type | Description |
| --- | --- | --- |
| float | <code>number</code> | The float to manipulate. |
| parts | <code>object</code> | The object holding information about which bits to set. |
| parts.exponent | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The exponent. |
| parts.significand | <code>number</code> \| <code>bigint</code> \| <code>Array.&lt;number&gt;</code> | The fractional part. |
| parts.signBit | <code>boolean</code> | Set it to make the float negative. |

<a name="float.clear"></a>

### float.clear ⇒ <code>number</code>
Clear bits (as in setting them to 0) in the float supplied. This is done using an object with information about which bits to clear in the exponent and the significand.

**Kind**: static property of [<code>float</code>](#float)  
**Returns**: <code>number</code> - A 64-bit float.  

| Param | Type | Description |
| --- | --- | --- |
| float | <code>number</code> | The float to manipulate. |
| parts | <code>object</code> | The object holding information about which bits to clear. |
| parts.exponent | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The exponent. |
| parts.significand | <code>number</code> \| <code>bigint</code> \| <code>Array.&lt;number&gt;</code> | The fractional part. |
| parts.signBit | <code>boolean</code> | Clear it to make a negative float positive. |


### End of readme
```
Death is not the end of your consciousness, it's the expansion of it.
```
