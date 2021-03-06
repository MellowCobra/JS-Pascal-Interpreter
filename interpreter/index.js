const { 
    AST, 
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
    Type,
    ProcedureDecl
} = require('./ast')
const {
    Symbol,
    BuiltinTypeSymbol,
    VarSymbol,
    ProcedureSymbol
} = require('./symbol')
const ScopedSymbolTable = require('./symbolTable')
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
        } else if (node instanceof Program) {
            return this.visit_Program(node)
        } else if (node instanceof Block) {
            return this.visit_Block(node)
        } else if (node instanceof VarDecl) {
            return this.visit_VarDecl(node)
        } else if (node instanceof Type) {
            return this.visit_Type(node)
        } else if (node instanceof ProcedureDecl) {
            return this.visit_ProcedureDecl(node)
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
            return parseFloat(this.visit(node.left) / this.visit(node.right))
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
            throw new Error(`Attempting to use variable "${varName}" without initializing`)
        }

        return this.GLOBAL_SCOPE[varName]
    }

    visit_NoOp(node) {
        return
    }

    visit_Program(node) {
        this.visit(node.block)
    }

    visit_Block(node) {
        for (let i in node.declarations) {
            this.visit(node.declarations[i])
        }
        this.visit(node.compoundStatement)
    }

    visit_VarDecl(node) {
        return
    }

    visit_Type(node) {
        return
    }

    visit_ProcedureDecl(node) {
        return
    }
}

class SemanticAnalyzer extends NodeVisitor {
    constructor() {
        super()
        this.currentScope = null
    }

    visit_Block(node) {
        for (let i in node.declarations) {
            this.visit(node.declarations[i])
        }
        this.visit(node.compoundStatement)
    }

    visit_Program(node) {
        console.log("ENTER scope: global")
        const globalScope = new ScopedSymbolTable("global", 1, this.currentScope)
        this.currentScope = globalScope

        this.visit(node.block)

        console.log(globalScope.toString())
        this.currentScope = this.currentScope.enclosingScope
        console.log("LEAVE scope: global")
    }

    visit_BinOp(node) {
        this.visit(node.left)
        this.visit(node.right)
    }

    visit_Num(node) {
        return
    }

    visit_UnaryOp(node) {
        this.visit(node.operand)
    }

    visit_Compound(node) {
        for (let i in node.children) {
            this.visit(node.children[i])
        }
    }

    visit_NoOp(node) {
        return
    }

    visit_VarDecl(node) {
        // Type info
        const typeName = node.typeNode.value
        const typeSymbol = this.currentScope.lookup(typeName)

        // Var info
        const varName = node.varNode.value
        const varSymbol = new VarSymbol(varName, typeSymbol)

        if (this.currentScope.contains(varName)) {
            // Variable already defined!
            throw new Error(`Attempting to redefine identifier "${varName}"`)
        }

        this.currentScope.define(varSymbol)
    }

    visit_Assign(node) {
        this.visit(node.left)
        this.visit(node.right)
    }

    visit_Var(node) {
        const varName = node.value
        const varSymbol = this.currentScope.lookup(varName)
        if (varSymbol == null) {
            throw new Error(`No variable "${varName}" defined`)
        }
    }
    
    visit_Type(node) {
        return
    }

    visit_ProcedureDecl(node) {
        const procName = node.procName
        const procSymbol = new ProcedureSymbol(procName)
        this.currentScope.define(procSymbol)

        console.log(`ENTER scope: ${procName}`)
        const procScope = new ScopedSymbolTable(procName, this.currentScope.scopeLevel + 1, this.currentScope)
        this.currentScope = procScope

        for (let param of node.params) {
            const paramType = this.currentScope.lookup(param.typeNode.value)
            const paramName = param.varNode.value
            const varSymbol = new VarSymbol(paramName, paramType)
            this.currentScope.define(varSymbol)
            procSymbol.params.push(varSymbol)
        }

        this.visit(node.blockNode)
        console.log(procScope.toString())
        console.log(`LEAVING scope: ${procName}`)
    }
}

module.exports = {
    Interpreter,
    SemanticAnalyzer
}