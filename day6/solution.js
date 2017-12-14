const input = '4 10 4 1 8 4 9 14 5 1 14 15 0 15 3 5'

function reallocateMemory(memoryBlocks) {
  const max = memoryBlocks.reduce((max, curr) => Math.max(max, curr))
  const indexForReallocation = memoryBlocks.indexOf(max)
  let numToReallocate = memoryBlocks[indexForReallocation]
  memoryBlocks[indexForReallocation] = 0

  let currIndex = indexForReallocation
  while (numToReallocate > 0) {
    currIndex = (currIndex + 1) % memoryBlocks.length
    memoryBlocks[currIndex] += 1
    numToReallocate -= 1
  }
}

function computeNumRedistributions(memoryBlocks) {
  const seenBlocks = {}

  let numRuns = 0
  while (true) {
    const currStateAsJson = JSON.stringify(memoryBlocks)
    if (seenBlocks[currStateAsJson]) {
      return numRuns
    }
    seenBlocks[currStateAsJson] = true

    reallocateMemory(memoryBlocks)
    numRuns += 1
  }
}

function computeNumRedistributionsWrapper(input) {
  const memoryBlocks = input.split(/\s+/).map(val => parseInt(val))
  return computeNumRedistributions(memoryBlocks)
}

const testInput = '0 2 7 0'
console.assert(5 === computeNumRedistributionsWrapper(testInput))
console.log('Part 1: ', computeNumRedistributionsWrapper(input))


function computeSizeOfLoop(input) {
  const memoryBlocks = input.split(/\s+/).map(val => parseInt(val))
  const numRedistributions = computeNumRedistributions(memoryBlocks)
  const state = JSON.stringify(memoryBlocks)

  let numRuns = 0
  while (true) {
    reallocateMemory(memoryBlocks)
    numRuns += 1

    if (JSON.stringify(memoryBlocks) === state) {
      return numRuns
    }
  }
}

console.assert(4 === computeSizeOfLoop(testInput))
console.log('Part 2: ', computeSizeOfLoop(input))
