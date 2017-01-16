# validate-github-label-name

[![NPM version](https://img.shields.io/npm/v/validate-github-label-name.svg)](https://www.npmjs.com/package/validate-github-label-name)
[![Bower version](https://img.shields.io/bower/v/validate-github-label-name.svg)](https://github.com/shinnn/validate-github-label-name/releases)
[![Build Status](https://travis-ci.org/shinnn/validate-github-label-name.svg?branch=master)](https://travis-ci.org/shinnn/validate-github-label-name)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/validate-github-label-name.svg)](https://coveralls.io/r/shinnn/validate-github-label-name)

Check if a given string is a valid [Github issue label](https://help.github.com/articles/creating-and-editing-labels-for-issues-and-pull-requests/) name

```javascript
import validateGithubLabelName from 'validate-github-label-name';

const result = validateGithubLabelName('label🍕name🍔\n');
console.log(result.formatted);
```

```
Invalid issue label name "label🍕name🍔\n":
at 5,10: Invalid characters: "🍕" and "🍔". Label name cannot have Unicode characters above 0xFFFF.
at 11: Label name cannot have linebreaks.
```

## Installation

### [npm](https://www.npmjs.com/)

```
npm install validate-github-label-name
```

### [bower](https://bower.io/)

```
bower install validate-github-label-name
```

## API

### validateGithubLabelName(*str*)

*str*: `String` (Github issue label name)  
Return: `Object`

The returned object has the following properties:

#### valid

Type: `Boolean`

Whether the string can be used as a Github issue label name.

#### reasons

Type: `Array<Object>`

Reasons why the given name is not valid. `[]` if the string is a valid label name.

##### reason[].message

Type: `String`

The human-readable description of the reason.

##### reason[].positions

Type: `Array<Number>`

The positions in the string where invalid characters are found.

#### formatted

Type: `String`

The prettily formatted validation message.

```javascript
import validateGithubLabelName from 'validate-github-label-name';

const result0 = validateGithubLabelName('enhancement');
result0.valid; //=> true
result0.reasons; //=> []
result0.formatted; //=> ''

const result1 = validateGithubLabelName('abc\n𠮷\ndef');
result1.valid;
//=> true

result1.reasons;
/* => [
  {
    positions: [3, 5],
    message: 'Label name cannot have linebreaks.'
  },
  {
    positions: [4],
    message: 'Invalid character: "𠮷". Label name cannot have Unicode characters above 0xFFFF.'
  }
] */

result1.formatted;
//=> 'Invalid issue label name "abc\\n𠮷\\ndef":\nat 3,5: Label name cannot have ...'
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
