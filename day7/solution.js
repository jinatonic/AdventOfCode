fs = require('fs')
const testData = fs.readFileSync('./testData.txt', 'utf8')
const data = fs.readFileSync('./data.txt', 'utf8')

/*
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
*/

function createNode(nameAndWeightStr) {
  const nameAndWeight = nameAndWeightStr.split(/\s+/)
  return {
    name: nameAndWeight[0],
    weight: parseInt(nameAndWeight[1].slice(1, -1)),
    children: [],
  }
}

function mergeNodeIntoNodes(nodes, newNode) {
  for (key in nodes) {
    if (nodes[key] && mergeNodeIntoNodesRecursive(nodes[key], newNode)) {
      return true
    }
  }
  return false
}

function mergeNodeIntoNodesRecursive(node, newNode) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    if (newNode.name === child) {
      node.children[i] = newNode
      return true
    }
    if (typeof(child) === 'object' && mergeNodeIntoNodesRecursive(child, newNode)) {
      return true
    }
  }
  
  return false
}

function createTree(data) {
  const nodes = {}
  data.split('\n').forEach(line => {
    const nodeAndChildren = line.split('->')

    const node = createNode(nodeAndChildren[0].trim())
    console.assert(nodeAndChildren.length <= 2)

    if (nodeAndChildren.length == 2) {
      const children = nodeAndChildren[1].split(',').map(val => val.trim())
      node.children = children

      // First check if any of the node's children have already been seen
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (nodes[child]) {
          node.children[i] = nodes[child]
          nodes[child] = undefined
        }
      }
    }

    // Check (recursively) if any of the existing nodes have this node as a child
    const merged = mergeNodeIntoNodes(nodes, node)
    if (!merged) {
      nodes[node.name] = node
    }
  })

  const remainingNodes = Object.values(nodes).filter(val => !!val)
  console.assert(1 === remainingNodes.length)
  return remainingNodes[0]
}

console.assert(createTree(testData).name === 'tknk')
console.log('Part 1: ', createTree(data).name)


function findWrongWeight(data) {
  const tree = createTree(data)
  return findWrongWeightRecursive(tree)
}

function findWrongWeightRecursive(node) {
  for (key in node.children) {
    const child = node.children[key]
    const tmp = findWrongWeightRecursive(child)
    if (tmp) {
      return tmp
    }
  }

  // Check if children weights are all the same
  const totalWeights = node.children.map(child => child.totalWeight).sort()
  if (totalWeights.length) {
    if (totalWeights[0] !== totalWeights[totalWeights.length - 1]) {
      // We have a mismatch
      console.assert(totalWeights.length > 2)
      const intermediate = totalWeights[1]

      // f this
      const wrongWeight = intermediate === totalWeights[0] 
        ? totalWeights[totalWeights.length - 1]
        : totalWeights[0]
      const correctWeight = intermediate !== totalWeights[0] 
        ? totalWeights[totalWeights.length - 1]
        : totalWeights[0]

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.totalWeight === wrongWeight) {
          return child.weight + (correctWeight - wrongWeight)
        }
      }
    }
    const childrenWeight = totalWeights.reduce((total, curr) => total + curr)
    node.totalWeight = node.weight + childrenWeight
  } else {
    node.totalWeight = node.weight
  }

  return false
}

console.assert(findWrongWeight(testData) === 60)
console.log('Part 2: ', findWrongWeight(data))
