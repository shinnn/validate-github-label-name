'use strict';

var appendType = require('append-type');
var arrayToSentence = require('array-to-sentence');
var arrIndexesOf = require('arr-indexes-of');
var indexedFilter = require('indexed-filter');

/*!
 * validate-github-label-name | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/validate-github-label-name
*/
function above0xffff(char) {
  return char.codePointAt(0) > 65535;
}

function getIndex(obj) {
  return obj.index;
}

function getQuotedValue(obj) {
  return '"' + obj.value + '"';
}

function compareStartPositions(reason, reasonNext) {
  return reason.positions[0] - reasonNext.positions[0];
}

function formatReason(reason) {
  return 'at ' + reason.positions.join(',') + ': ' + reason.message;
}

function validateGithubLabelName(str) {
  if (typeof str !== 'string') {
    throw new TypeError(
      'Expected a string to check whether it is a valid Github issue label name, but got ' +
      appendType(str) +
      '.'
    );
  }

  var chars = Array.from(str);
  var reasons = [];

  if (chars.length === 0) {
    reasons.push({
      positions: [0],
      message: 'Label name must include at least one character.'
    });
  }

  if (/^[\0\s]+$/.test(str)) {
    reasons.push({
      positions: [0],
      message: 'Label name must include at least one non-whitespace character.'
    });
  }

  var indexesOfLinebreaks = arrIndexesOf(chars, '\n');

  if (indexesOfLinebreaks.length !== 0) {
    reasons.push({
      positions: indexesOfLinebreaks,
      message: 'Label name cannot have linebreaks.'
    });
  }

  var fourByteChars = indexedFilter(chars, above0xffff);

  if (fourByteChars.length !== 0) {
    reasons.push({
      positions: fourByteChars.map(getIndex),
      message: 'Invalid character' +
               (fourByteChars.length === 1 ? '' : 's') +
               ': ' +
               arrayToSentence(fourByteChars.map(getQuotedValue)) +
               '. Label name cannot have Unicode characters above 0xFFFF.'
    });
  }

  reasons.sort(compareStartPositions);

  var isValid = reasons.length === 0;

  return {
    valid: isValid,
    reasons: reasons,
    formatted: isValid ? '' : 'Invalid issue label name ' + JSON.stringify(str) + ':\n' +
                              reasons.map(formatReason).join('\n')
  };
}

module.exports = validateGithubLabelName;
