'use strict';

const test = require('tape');
const main = require('.');

test('validateGithubLabelName()', t => {
  t.deepEqual(
    main('abcあア亜'),
    {
      valid: true,
      reasons: [],
      formatted: ''
    },
    'should validate Git branch name.'
  );

  t.throws(
    () => main(1),
    /^TypeError.*but got 1 \(number\)\./,
    'should throw a type error when the first argument is not an array.'
  );

  t.throws(
    () => main(),
    /^TypeError.*Expected a string to check whether it is a valid Github issue label name, /,
    'should throw a type error when it takes no arguments.'
  );

  t.end();
});

test('result.valid', t => {
  t.strictEqual(
    main('a\nb').valid,
    false,
    'should indicate whether the string is a valid branch name or not.'
  );

  t.end();
});

test('result.reasons', t => {
  t.deepEqual(
    main('').reasons,
    [{
      positions: [0],
      message: 'Label name must include at least one character.'
    }],
    'should invalidate zero-length label name.'
  );

  t.deepEqual(
    main('\0 \t').reasons,
    [{
      positions: [0],
      message: 'Label name must include at least one non-whitespace character.'
    }],
    'should invalidate whitespace-only string.'
  );

  t.deepEqual(
    main('x\ny\n\n').reasons,
    [{
      positions: [1, 3, 4],
      message: 'Label name cannot have linebreaks.'
    }],
    'should invalidate the label name including linebreaks.'
  );

  t.deepEqual(
    main('🍣𠮷').reasons,
    [{
      positions: [0, 1],
      message: 'Invalid characters: "🍣" and "𠮷". Label name cannot have Unicode characters above 0xFFFF.'
    }],
    'should invalidate the label name including UTF-8 4-byte characters.'
  );

  t.end();
});

test('result.formatted', t => {
  const expected = `Invalid issue label name "_\\n-🐷\\n":
at 1,4: Label name cannot have linebreaks.
at 3: Invalid character: "🐷". Label name cannot have Unicode characters above 0xFFFF.`;

  t.strictEqual(
    main('_\n-🐷\n').formatted,
    expected,
    'should be a pretty error message.'
  );

  t.end();
});

