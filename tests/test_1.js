
import * as bm from '../source/bitManipulation.js'
import {assert} from './shared.js'
const log = console.log

function test_1(bigInt) {
  function value(value) {
    return bigInt ? BigInt(value) : value
  }
  function check(against) {
    return function(value) {
      console.log(bm.numberToBinary(value))
      if (bigInt && typeof value != 'bigint') throw Error('Should have gotten a BigInt...')
      if (value !== (bigInt ? BigInt(against) : against)) throw Error(value+' is different from '+against)
    }
  }
  let n = bm.serial(value(0))
  .set(1,8).x(check(0b1000_0001))
  .flip(1,2).x(check(0b1000_0010))
  .clear(7,8).x(check(0b0000_0010))
  .xor(value(0xFF)).x(check(0b1111_1101))
  .and(value(0b1111)).x(check(0b1101))
  .or(value(0b0110)).x(check(0b1111))
  .lShift(8).x(check(0b1111_0000_0000))
  .rShift(10).x(check(0b11))
  .reverseBitOrder(8).x(check(0b1100_0000))
  .not().x(check(-193)) // this will set the sign bit, hence leading 1s (becaue of two's complement)
  .out() // store the number in n
  assert(bm.isSet(n, 1,2,3,4), true)
  assert(bm.isSet(n, 1,2,3,4,7,8), false)
  assert(bm.isAnySet(n, 1,2,3,4,7,8), true)
  assert(bm.isAnySet(n, 7,8), false)
  assert(bm.isNotSet(n, 7,8), true)
  assert(bm.isNotSet(n, 1,2), false)
  assert(bm.bitLength(value(0xFF_FFFF_FFFF)), 40)
  n = bm.serial(value(-1))
  .not(8).x(check(-256))
}

log('Testing Number...')
test_1(false)
log()
log('Testing BigInt...')
test_1(true)
