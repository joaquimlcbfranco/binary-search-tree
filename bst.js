class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = array;
    // const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }

    const midIndex = Math.floor((start + end) / 2);
    const root = new Node(array[midIndex]);

    root.left = this.buildTree(array, start, midIndex - 1);
    root.right = this.buildTree(array, midIndex + 1, end);


    return root;
  }

  insert(value) {
    let currNode = this.root;
    let parent = null;
    const node = new Node(value);

    while (currNode !== null) {
      parent = currNode;
      if (currNode.data > node.data) {
        currNode = currNode.left;
      }
      else if (currNode.data < node.data) {
        currNode = currNode.right;
      }
      else {
        return this.root;
      }
    }

    if (parent.data > node.data) {
      parent.left = node;
    }
    else if (parent.data < node.data) {
      parent.right = node;
    }
  }

  nextBigger(root) {
    let curr = root.right;
    while (curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }

  deleteItem(value) {
    let currNode = this.root;
    let parent = null;

    while (currNode !== null && currNode.data !== value) {
      parent = currNode;

      if (currNode.data > value) {
        currNode = currNode.left;
      }
      else if (currNode.data < value) {
        currNode = currNode.right;
      }
    }

    if (currNode === null) {
      return this.root;
    }

    if (currNode.left === null || currNode.right === null) {
      let newCurr = (currNode.left === null) ? currNode.right : currNode.left;

      if (parent.left === currNode) {
        parent.left = newCurr;
      }
      else {
        parent.right = newCurr;
      }
    }
    else {
      let next = this.nextBigger(currNode);
      currNode.data = next.data;
      let p = null;
      let temp = currNode.right
      while (temp.left !== null) {
        p = temp;
        temp = temp.left;
      }

      if (p !== null) {
        p.left = temp.right;
      }
      else {
        currNode.right = temp.right;
      }
    }

    return this.root;
  }

  find(value) {
    let currNode = this.root;
    while (currNode !== null) {
      if (currNode.data > value) {
        currNode = currNode.left;
      }
      else if (currNode.data < value) {
        currNode = currNode.right;
      }
      else {
        return currNode;
      }
    }
    return this.root;
  }

  levelOrder(callback) {
    if (callback === undefined) {
      throw new Error('Please provide a callback function/argument');
    }

    const root = this.root;
    if (root === null) {
      return;
    }

    let queue = []
    queue.push(root);
    while (queue.length !== 0) {
      let currNode = queue[0];
      callback(currNode);
      if (currNode.left !== null) {
        queue.push(currNode.left);
      }
      if (currNode.right !== null) {
        queue.push(currNode.right);
      }
      queue.shift();
    }
  }

  inOrder(callback, root = this.root) {
    if (root === null) {
      return;
    }

    this.inOrder(callback, root.left);
    callback(root);
    this.inOrder(callback, root.right);
  }

  preOrder(callback, root = this.root) {
    if (root === null) {
      return;
    }

    callback(root);
    this.preOrder(callback, root.left);
    this.preOrder(callback, root.right);
  }

  postOrder(callback, root = this.root) {
    if (root === null) {
      return;
    }

    this.postOrder(callback, root.left);
    this.postOrder(callback, root.right);
    callback(root);
  }

  height(node = this.root) {
    if (node === null) {
      return 0;
    }

    let leftCounter = this.height(node.left);
    let rightCounter = this.height(node.right);

    return Math.max(leftCounter, rightCounter) + 1;
  }

  depth(node = this.root) {
    let root = this.root;
    let counter = 0;

    while (root !== node) {
      if (root.data > node.data) {
        root = root.left;
        counter++;
      }
      else if (root.data < node.data) {
        root = root.right;
        counter++;
      }
    }

    return counter;
  }

  isBalanced(node = this.root) {    
    if (node === null) {
      return true;
    }

    let leftCounter = this.height(node.left);
    let rightCounter = this.height(node.right);

    if (Math.abs(leftCounter - rightCounter) > 1) {
      return false;
    }

    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  rebalance() {
    const root = this.root;
    const newArray = []
    if (root === null) {
      return;
    }

    let queue = []
    queue.push(root);
    while (queue.length !== 0) {
      let currNode = queue[0];
      newArray.push(currNode.data);
      if (currNode.left !== null) {
        queue.push(currNode.left);
      }
      if (currNode.right !== null) {
        queue.push(currNode.right);
      }
      queue.shift();
    }

    this.root = this.buildTree(newArray, 0, newArray.length - 1);
  }

  prettyPrint (node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

function arrayOfNumbers() {
  let array = [];
  for (let i = 0; i < 10; i++) {
    const number = Math.floor(Math.random() * 99);
    array.push(number)
  }

  return array;
}

function driverScript() {
  // Create an array of 10 random numbers
  const array = arrayOfNumbers();

  // Create the binary search tree and check if it's balanced
  const tree = new Tree(array);
  tree.prettyPrint(tree.root);
  console.log('Balanced? ', tree.isBalanced());

  // Print out all elements in the tree using the four different traversal methods
  let levelOrder = '';
  tree.levelOrder((element) => {
    levelOrder += `${element.data} `
  })
  console.log(levelOrder);
  let preOrder = '';
  tree.levelOrder((element) => {
    preOrder += `${element.data} `
  })
  console.log(preOrder);
  let postOrder = '';
  tree.postOrder((element) => {
    postOrder += `${element.data} `
  })
  console.log(postOrder);
  let inOrder = '';
  tree.inOrder((element) => {
    inOrder += `${element.data} `
  })
  console.log(inOrder);

  // Unbalance the tree by inserting elements bigger than 100, so they access node.right everytime they're added. Check if it's unbalanced
  tree.insert(106);
  tree.insert(107);
  console.log('Balanced? ', tree.isBalanced());

  // Balance the tree by calling rebalance method and check again
  tree.rebalance();
  console.log('Balanced? ', tree.isBalanced());

  // Print out all elements again
  levelOrder = '';
  tree.levelOrder((element) => {
    levelOrder += `${element.data} `
  })
  console.log(levelOrder);
  preOrder = '';
  tree.levelOrder((element) => {
    preOrder += `${element.data} `
  })
  console.log(preOrder);
  postOrder = '';
  tree.postOrder((element) => {
    postOrder += `${element.data} `
  })
  console.log(postOrder);
  inOrder = '';
  tree.inOrder((element) => {
    inOrder += `${element.data} `
  })
  console.log(inOrder);
}

driverScript();