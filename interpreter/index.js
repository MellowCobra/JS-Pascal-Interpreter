const { 
    AST, 
    BinOp, 
    UnaryOp, 
    Num,
    Compound,
    Assign,
    Var,
    NoOp
} = require('./ast')
const Parser = require('./parser')
const Token = require('./token')
const TokenType = require('./tokenType')

class NodeVisitor {
    constructor(node) {}

    visit(node) {
        if (node instanceof BinOp) {
            return this.visit_BinOp(node)
        } else if (node instanceof Num) {
            return this.visit_Num(node)
        } else if (node instanceof UnaryOp) {
            return this.visit_UnaryOp(node)
        } else if (node instanceof Compound) {
            return this.visit_Compound(node)
        } else if (node instanceof Assign) {
            return this.visit_Assign(node)
        } else if (node instanceof Var) {
            return this.visit_Var(node)
        } else if (node instanceof NoOp) {
            return this.visit_NoOp(node)
        } else {
            throw new Error(`No visit_{} method for node ${JSON.stringify(node)}`)
        }
    }
}

class Interpreter extends NodeVisitor {
    constructor(program) {
        super()
        this.parser = new Parser(program)
        this.GLOBAL_SCOPE = {}
    }

    interpret() {
        let ast = this.parser.parse()
        return this.visit(ast)
    }

    visit_BinOp(node) {
        let op = node.op

        if (op.type === TokenType.PLUS) {
            return this.visit(node.left) + this.visit(node.right)
        } else if (op.type === TokenType.MINUS) {
            return this.visit(node.left) - this.visit(node.right)
        } else if (op.type === TokenType.MUL) {
            return this.visit(node.left) * this.visit(node.right)
        } else if (op.type === TokenType.DIV) {
            return this.visit(node.left) / this.visit(node.right)
        } else if (op.type === TokenType.IDIV) {
            return parseInt(this.visit(node.left) / this.visit(node.right))
        }
    }

    visit_UnaryOp(node) {
        let op = node.op
        
        if (op.type === TokenType.PLUS) {
            return this.visit(node.operand)
        } else if (op.type === TokenType.MINUS) {
            return -1 * this.visit(node.operand)
        }
    }

    visit_Num(node) {
        return node.value
    }

    visit_Compound(node) {
        for (let i in node.children) {
            this.visit(node.children[i])
        }
    }

    visit_Assign(node) {
        let varName = node.left.value
        this.GLOBAL_SCOPE[varName] = this.visit(node.right)
    }

    visit_Var(node) {
        let varName = node.value
        if (this.GLOBAL_SCOPE[varName] == undefined ) {
            throw new Error(`No variable ${varName} defined`)
        }

        return this.GLOBAL_SCOPE[varName]
    }

    visit_NoOp(node) {
        return
    }
}

module.exports = Interpreter