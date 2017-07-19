'use strict';

const ES = require('es-abstract');

if (typeof Symbol !== 'function' || !Symbol.isConcatSpreadable) {
  throw new Error('Symbol.isConcatSpreadable missing from the environment');
}

if (typeof Array.prototype.flatMap !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true,
    writable: true,
    // https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
    value: function flatMap(callback, thisArg = undefined) {
      const O = ES.ToObject(this);
      const A = new (ES.SpeciesConstructor(O, Array))(0);
      flattenIntoArray(A, O, 0, 1, callback, thisArg);
      return A;
    },
  });
}

if (typeof Array.prototype.flatten !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'flatten', {
    configurable: true,
    writable: true,
    // https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
    value: function flatten(depthArg = 1) {
      const O = ES.ToObject(this);
      const A = new (ES.SpeciesConstructor(O, Array))(0);
      const depth = ES.ToInteger(depthArg);
      flattenIntoArray(A, O, 0, depth);
      return A;
    },
  });
}

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
/**
 * @param {any[]} target
 * @param {any[]} source
 * @param {number} start
 * @param {number} depth
 * @param {Function=} mapper
 * @param {any=} thisArg
 */
function flattenIntoArray(target, source, start, depth, mapper, thisArg) {
  let targetIndex = start;
  let sourceIndex = 0;
  const sourceLen = ES.ToLength(source.length);

  while (sourceIndex < sourceLen) {
    const P = `${sourceIndex}`;
    if (P in source) {
      let element = source[P];
      if (mapper) {
        element = mapper.call(thisArg, element, sourceIndex, target);
      }
      let spreadable;
      // https://tc39.github.io/ecma262/#sec-isconcatspreadable
      if (typeof element !== 'object') {
        spreadable = false;
      } else {
        spreadable = element[Symbol.isConcatSpreadable];
        if (typeof spreadable !== 'undefined') {
          spreadable = !!spreadable;
        } else {
          spreadable = Array.isArray(element);
        }
      }

      if (spreadable && depth > 0) {
        const nextIndex = flattenIntoArray(target, element, targetIndex, depth - 1);
        targetIndex = nextIndex - 1;
      } else {
        if (targetIndex !== ES.ToLength(targetIndex)) {
          throw TypeError();
        }
        // eslint-disable-next-line no-param-reassign
        target[targetIndex] = element;
      }
    }
    targetIndex += 1;
    sourceIndex += 1;
  }
  return targetIndex;
}
