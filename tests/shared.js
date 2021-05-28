
export function assert(...arg) {
  switch (arg.length) {
    case 1: if (!arg[0]) throw Error('Assertion failed!'); break
    case 2:
    case 3: if (arg[0] !== arg[1]) throw Error(arg[0]+' !== '+arg[1]+' '+(arg[2] || 'Assertion failed!')); break
  }
}
