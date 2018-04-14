class Node {
    constructor() {}
}

class BinOp extends Node {
    constructor(token, left, right) {
        super()
        this.left = left
        this.token = this.op = token
        this.right = right
    }
}

class UnaryOp extends Node {
    constructor(token, operand) {
        super()
        this.token = this.op = token
        this.operand = operand
    }
}

class Num extends Node {
    constructor(token) {
        super()
        this.token = token
        this.value = token.value
    }
}

module.exports = {
    Node,
    BinOp,
    UnaryOp,
    Num
}