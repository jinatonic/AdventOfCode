/*
--- Day 3: Spiral Memory ---

You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and then counting up while spiraling outward. For example, the first few squares are allocated like this:

17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
While this is very space-efficient (no squares are skipped), requested data must be carried back to square 1 (the location of the only access port for this memory system) by programs that can only move up, down, left, or right. They always take the shortest path: the Manhattan Distance between the location of the data and square 1.

For example:

Data from square 1 is carried 0 steps, since it's at the access port.
Data from square 12 is carried 3 steps, such as: down, left, left.
Data from square 23 is carried only 2 steps: up twice.
Data from square 1024 must be carried 31 steps.
How many steps are required to carry the data from the square identified in your puzzle input all the way to the access port?
*/

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

console.assert(0 === calcDistanceFromCenter(1))
console.assert(3 === calcDistanceFromCenter(12))
console.assert(2 === calcDistanceFromCenter(23))
console.assert(31 === calcDistanceFromCenter(1024))

console.log('Part 1: ', calcDistanceFromCenter(265149))


/*
--- Part Two ---

As a stress test on the system, the programs here clear the grid and then store the value 1 in square 1. Then, in the same allocation order as shown above, they store the sum of the values in all adjacent squares, including diagonals.

So, the first few squares' values are chosen as follows:

Square 1 starts with the value 1.
Square 2 has only one adjacent filled square (with value 1), so it also stores 1.
Square 3 has both of the above squares as neighbors and stores the sum of their values, 2.
Square 4 has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
Square 5 only has the first and fourth squares as neighbors, so it gets the value 5.
Once a square is written, its value does not change. Therefore, the first few squares would receive the following values:

147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
What is the first value written that is larger than your puzzle input?
*/

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
console.assert(5 === getMatrixCellValue(testMatrix, 0, 0))

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

console.assert(4 === findFirstLargest(2))
console.assert(54 === findFirstLargest(50))
console.assert(362 === findFirstLargest(351))

console.log('Part 2: ', findFirstLargest(265149))
