fs = require('fs')

function getNumValidPassphrases(file, validation) {
  const data = fs.readFileSync(file, 'utf8')
  return data.split('\n')
    .map(line => validation(line) ? 1 : 0)
    .reduce((total, curr) => total + curr)
}

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
