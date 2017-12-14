function findDimensionOfGrid(num) {
  // Note that each square ends with a square of odd number, e.g. 1, 9, 25, 49
  // Naive way to find outer square
  let i = 1
  while (true) {
    if (i * i >= num) {
      return i
    }
    i += 2
  }
}

function calcDistanceFromCenter(num) {
  const dimen = findDimensionOfGrid(num)
  const numPerSide = dimen - 1
	const lastNumInInner = (dimen - 2) * (dimen - 2)
	// size of outer square is i

	let row, col
	if (lastNumInInner + numPerSide >= num) {
		// right side
		row = (lastNumInInner + numPerSide) - num
		col = dimen - 1
	} else if (lastNumInInner + numPerSide * 2 >= num) {
		//. top side
		row = 0
		col = (lastNumInInner + numPerSide * 2) - num
	} else if (lastNumInInner + numPerSide * 3 >= num) {
		// left side
		row = (lastNumInInner + numPerSide * 3) - num
		col = 0
	} else {
		// bottom side
		row = dimen - 1
		col = (dimen * dimen) - num
	}

  // now we have row, col, we simply need to calculate distance from center
  const center = Math.floor(dimen / 2)
  return Math.abs(row - center) + Math.abs(col - center)
}

console.assert(calcDistanceFromCenter(1) === 0)
console.assert(calcDistanceFromCenter(12) === 3)
console.assert(calcDistanceFromCenter(23) === 2)
console.assert(calcDistanceFromCenter(1024) === 31)
console.log('Part 1: ', calcDistanceFromCenter(265149))


const adjacents = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
function getMatrixCellValue(matrix, row, col) {
  // Find all adjacent cells for find sum
  const matrixLen = matrix.length
  return adjacents
    .map(offsets => [row + offsets[0], col + offsets[1]])
    .filter(indices => indices[0] >= 0 && 
      indices[1] >= 0 && 
      indices[0] < matrixLen && 
      indices[1] < matrixLen
    )
    .map(indices => matrix[indices[0]][indices[1]] || 0)
    .reduce((total, curr) => total + curr)
}

const testMatrix = [[undefined, 4, 2], [undefined, 1, 1], [ undefined, undefined, undefined]]
console.assert(getMatrixCellValue(testMatrix, 0, 0) === 5)

function findFirstLargest(num) {
  // sigh, i think i have to construct the whole matrix..
  const maxDimen = findDimensionOfGrid(num)
  const matrix = Array.from(Array(maxDimen)).map(() => Array(maxDimen).fill(0))

  // r, u, l, l, d ,d, r, r, r, u, u, u, l, l, l, l, d, d, d, d, r, r, r, r, r...
  const dirs = [[0, 1], [-1, 0], [0, -1], [1, 0]]
  const extra = [0, 0, 1, 1]

  let row = Math.floor(maxDimen / 2)
  let col = row
  let currentDir = 0
  let incrementSize = 1
  let currentIncrement = 0

  matrix[row][col] = 1
  while (true) {
    // Move to next index
    const dir = dirs[currentDir]
    row += dir[0]
    col += dir[1]
    currentIncrement += 1

    // Change direction if necessary
    if (currentIncrement >= incrementSize + extra[currentDir]) {
      currentDir = currentDir + 1
      currentIncrement = 0
      if (currentDir == dirs.length) {
        incrementSize += 2
        currentDir = 0
      }
    }

    // Fill the current value
    const val = getMatrixCellValue(matrix, row, col)
    if (val > num) {
      return val
    }
    matrix[row][col] = val
  } 
}

console.assert(findFirstLargest(2) === 4)
console.assert(findFirstLargest(50) === 54)
console.assert(findFirstLargest(351) === 362)
console.log('Part 2: ', findFirstLargest(265149))
