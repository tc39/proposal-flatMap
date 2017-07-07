'use strict'

if (typeof Symbol !== 'function' || !Symbol.isConcatSpreadable) {
  throw new Error('Symbol.isConcatSpreadable missing from the environment')
}

if (typeof Array.prototype.flatMap !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'flatMap', {
    enumerable: false,
    // https://bterlson.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
    value: function flatMap (callback, thisArg = undefined) {
      const O = toObject(this)
      const A = arraySpeciesCreate(O, 0)
      // typo in the github pages render, it's missing
      // the ", 1" argument, but it is present in
      // the master source code
      flattenIntoArray(A, O, 0, 1, callback, thisArg)
      return A
    }
  })
}

if (typeof Array.prototype.flatten !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'flatten', {
    enumerable: false,
    // https://bterlson.github.io/proposal-flatMap/#sec-Array.prototype.flatten
    value: function flatten (depth = Infinity) {
      const O = toObject(this)
      const A = arraySpeciesCreate(O, 0)
      depth = Number(depth)
      flattenIntoArray(A, O, 0, depth)
      return A
    }
  })
}

// https://bterlson.github.io/proposal-flatMap/#sec-FlattenIntoArray
function flattenIntoArray (target, source, start, depth, mapper, thisArg) {
  let targetIndex = start
  let sourceIndex = 0
  const sourceLen = toLength(source.length)

  while (sourceIndex < sourceLen) {
    const P = `${sourceIndex}`
    if (P in source) {
      let element = source[P]
      if (mapper) {
        element = mapper.call(thisArg, element, sourceIndex, target)
      }
      let spreadable
      // https://tc39.github.io/ecma262/#sec-isconcatspreadable
      if (typeof element !== 'object') {
        spreadable = false
      } else {
        spreadable = element[Symbol.isConcatSpreadable]
        if (typeof spreadable !== 'undefined') {
          spreadable = !!spreadable
        } else {
          spreadable = Array.isArray(element)
        }
      }

      // spec deviation: the spec specifies "depth >= 0",
      // but that incorrectly flattens one level too far.
      // https://github.com/bterlson/proposal-flatMap/issues/11
      if (spreadable && depth > 0) {
        const nextIndex = flattenIntoArray(target, element, targetIndex, depth - 1)
        // spec deviation: decrement targetIndex by 1 here
        // it will get incremented back at the tail of the loop
        // https://github.com/bterlson/proposal-flatMap/issues/13
        targetIndex = nextIndex - 1
      } else {
        if (targetIndex !== toLength(targetIndex)) {
          throw TypeError()
        }
        target[targetIndex] = element
      }
    }
    targetIndex += 1
    sourceIndex += 1
  }
  return targetIndex
}

// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
function arraySpeciesCreate (original, length) {
  length = toLength(length)
  if (length < 0) {
    throw new RangeError()
  }

  let C
  if (!Array.isArray(original)) {
    C = original.constructor

    // Trick to implement the Realm check
    // from core-js
    if (typeof C === 'function' &&
      (C === Array || Array.isArray(C.prototype))) {
      C = undefined
    }

    if (typeof C === 'object' ? C !== null : typeof C === 'function') {
      C = C[Symbol.species]
      if (C === null) {
        C = undefined
      }
    }
  }

  if (typeof C === 'undefined') {
    C = Array
  }

  return new C(length)
}

// These are more-or-less like the core-js implementations
// in modules/_to-{length,integer,object}

function toLength (arg) {
  return arg > 0 ? Math.min(toInteger(arg), 0x1fffffffffffff) : 0
}

function toInteger (arg) {
  arg = +arg
  return isNaN(arg) ? 0 : (arg > 0 ? Math.floor : Math.ceil)(arg)
}

function toObject (arg) {
  if (arg === undefined) {
    throw new TypeError(`Can't call method on ${arg}`)
  }
  return Object(arg)
}
