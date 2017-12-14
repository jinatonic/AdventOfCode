fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf8')

function computeNumJumps(input) {
  const instructions = input.split('\n').map(val => parseInt(val))
  let currentIndex = 0
  let numJumps = 0
  while (true) {
    const prevIndex = currentIndex
    currentIndex += instructions[currentIndex]
    instructions[prevIndex] += 1
    numJumps += 1

    if (currentIndex >= instructions.length) {
      return numJumps
    }
  }
}

const testInput = "0\n3\n0\n1\n-3"
console.assert(5 === computeNumJumps(testInput))
console.log('Part 1: ', computeNumJumps(data))


function computeNumJumpsPart2(input) {
  const instructions = input.split('\n').map(val => parseInt(val))
  let currentIndex = 0
  let numJumps = 0
  while (true) {
    const prevIndex = currentIndex
    const offset = instructions[currentIndex]
    currentIndex += offset
    instructions[prevIndex] += offset >= 3 ? -1 : 1
    numJumps += 1

    if (currentIndex < 0 || currentIndex >= instructions.length) {
      return numJumps
    }
  }
}

console.assert(10 === computeNumJumpsPart2(testInput))
console.log('Part 2: ', computeNumJumpsPart2(data))
