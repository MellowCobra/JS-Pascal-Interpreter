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

class Compound extends Node {
    constructor() {
        super()
        this.children = []
    }
}

class Assign extends Node {
    constructor(token, left, right) {
        super()
        this.left = left
        this.token = this.op = token
        this.right = right
    }
}

class Var extends Node {
    constructor(token) {
        super()
        this.token = token
        this.value = token.value
    }
}

class NoOp extends Node {
    constructor() {
        super()
    }
}

class Program extends Node {
    constructor(name, block) {
        super()
        this.name = name
        this.block = block
    }
}

class Block extends Node {
    constructor(declarations, compoundStatement) {
        super()
        this.declarations = declarations
        this.compoundStatement = compoundStatement
    }
}

class VarDecl extends Node {
    constructor(varNode, typeNode) {
        super()
        this.varNode = varNode
        this.typeNode = typeNode
    }
}

class Type extends Node {
    constructor(token) {
        super()
        this.token = token,
        this.value = token.value
    }
}

module.exports = {
    Node,
    BinOp,
    UnaryOp,
    Num,
    Compound,
    Assign,
    Var,
    NoOp,
    Program,
    Block,
    VarDecl,
    Type
}