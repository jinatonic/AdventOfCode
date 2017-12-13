fs = require('fs')

function getNumValidPassphrases(file, validation) {
  const data = fs.readFileSync(file, 'utf8')
  return data.split('\n')
    .map(line => validation(line) ? 1 : 0)
    .reduce((total, curr) => total + curr)
}

/*
--- Day 4: High-Entropy Passphrases ---

A new system policy has been put in place that requires all accounts to use a passphrase instead of simply a password. A passphrase consists of a series of words (lowercase letters) separated by spaces.

To ensure security, a valid passphrase must contain no duplicate words.

For example:

aa bb cc dd ee is valid.
aa bb cc dd aa is not valid - the word aa appears more than once.
aa bb cc dd aaa is valid - aa and aaa count as different words.
The system's full passphrase list is available as your puzzle input. How many passphrases are valid?
*/

function isPassphraseValid(passphrase) {
  const words = passphrase.split(/\s+/)
  let foundDuplicate = false
  words.forEach((item, index) => {
    if (words.indexOf(item, index + 1) >= 0) {
      foundDuplicate = true
    }
  })
  return !foundDuplicate
}

console.assert(true === isPassphraseValid('aa bb cc dd ee'))
console.assert(false === isPassphraseValid('aa bb cc dd aa'))
console.assert(true === isPassphraseValid('aa bb cc dd aaa'))

console.log('Part 1: ', getNumValidPassphrases('./data.txt', isPassphraseValid))


/*
--- Part Two ---

For added security, yet another system policy has been put in place. Now, a valid passphrase must contain no two words that are anagrams of each other - that is, a passphrase is invalid if any word's letters can be rearranged to form any other word in the passphrase.

For example:

abcde fghij is a valid passphrase.
abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.
a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.
iiii oiii ooii oooi oooo is valid.
oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.
Under this new system policy, how many passphrases are valid?
*/

function compareSortedArrs(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

function isPassphraseValidWithAnagramRule(passphrase) {
  const words = passphrase.split(/\s+/)
  let isValid = true
  words.forEach((item, index) => {
    const base = Array.from(item).sort()
    for (let i = index + 1; i < words.length; i++) {
      const compare = Array.from(words[i]).sort()
      if (compareSortedArrs(base, compare)) {
        isValid = false
        return
      }
    }
  })
  return isValid
}

console.assert(true === isPassphraseValidWithAnagramRule('abcde fghij'))
console.assert(false === isPassphraseValidWithAnagramRule('abcde xyz ecdab'))
console.assert(true === isPassphraseValidWithAnagramRule('a ab abc abd abf abj'))
console.assert(true === isPassphraseValidWithAnagramRule('iiii oiii ooii oooi oooo'))
console.assert(false === isPassphraseValidWithAnagramRule('oiii ioii iioi iiio'))

console.log('Part 2: ', getNumValidPassphrases('./data.txt', isPassphraseValidWithAnagramRule))
