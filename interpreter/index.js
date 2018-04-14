const { AST, BinOp, UnaryOp, Num } = require('./ast')
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
        } else {
            throw new Error(`No visit_{} method for node ${JSON.stringify(node)}`)
        }
    }
}

class Interpreter extends NodeVisitor {
    constructor(program) {
        super()
        this.parser = new Parser(program)
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
}

module.exports = Interpreter