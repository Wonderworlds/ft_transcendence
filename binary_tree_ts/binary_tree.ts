
//tsc --target es2015 binary_tree.ts 

class TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: string) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  buildTree(players: string[]): void {
    const nodes = players.map(player => new TreeNode(player));
    const queue: TreeNode[] = [...nodes];

    while (queue.length > 1) {
      const levelSize = queue.length;

      for (let i = 0; i < levelSize; i += 2) {
        const left = queue.shift()!;
        const right = queue.shift()!;

        const parentTreeNode = new TreeNode("");
        parentTreeNode.left = left;
        parentTreeNode.right = right;

        queue.push(parentTreeNode);
      }
    }
    this.root = queue[0];
  }

  printTree(): void {
    this.printTreeHelper(this.root, 0);
  }

  printTreeHelper(node: TreeNode | null, level: number): void {
    if (node !== null) {
      this.printTreeHelper(node.right, level + 1);
      console.log("  ".repeat(level) + node.value);
      this.printTreeHelper(node.left, level + 1);
    }
  }

  playTournament(): void {
    const depth = this.calculateDepth(this.root) - 1;
    for (let d = depth; d >= 1; d--) {
      console.log(`Playing matches at depth ${d}`);
      this.playMatchesAtDepth(this.root, d);
    }
  }

  playMatchesAtDepth(node: TreeNode | null, targetDepth: number, currentDepth: number = 1): void {
    if (node !== null && currentDepth < targetDepth) {
      this.playMatchesAtDepth(node.left, targetDepth, currentDepth + 1);
      this.playMatchesAtDepth(node.right, targetDepth, currentDepth + 1);
    } else if (currentDepth === targetDepth && node!.left && node!.right) {
      console.log(`${node!.left.value} vs ${node!.right.value}`);
      this.playMatch(node!);
    }
  }

  playMatch(node: TreeNode): void {
    // match logic and update the winner in the node
    const winnerTreeNode = new TreeNode(`${node!.left!.value}`);
    winnerTreeNode.left = node!.left;
    winnerTreeNode.right = node!.right;
    node!.value = winnerTreeNode.value;
  }

  calculateDepth(node: TreeNode | null): number {
    if (node === null) {
      return 0;
    }
    const leftDepth = this.calculateDepth(node.left);
    const rightDepth = this.calculateDepth(node.right);
    return Math.max(leftDepth, rightDepth) + 1;
  }
}

const players: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const tournament = new BinaryTree();
tournament.buildTree(players);
tournament.printTree();
tournament.playTournament();
tournament.printTree();

