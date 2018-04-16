const Lexer = require('./lexer')
const Token = require('./token')
const TokenType = require('./tokenType')
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
    Type
} = require('./ast')

class Parser {
    constructor(program) {
        this.lexer = new Lexer(program)
        this.currentToken = this.lexer.getNextToken()
    }

    parse() {
        let node = this.program()

        if (this.currentToken.type !== TokenType.EOF) {
            throw new Error(`Unexpected token ${JSON.stringify(this.currentToken)} after the program termination symbol "."`)
        }

        return node
    }

    program() {
        // program : PROGRAM variable SEMI block DOT
        this.eat(TokenType.PROGRAM)

        let varNode = this.variable()
        let name = varNode.value

        this.eat(TokenType.SEMI)

        let blockNode = this.block()
        let programNode = new Program(name, blockNode)

        this.eat(TokenType.DOT)
        return programNode
    }

    block() {
        // block : declarations compound_statement

        const declarationNodes = this.declarations()
        const compoundStatementNode = this.compound_statement()
        return new Block(declarationNodes, compoundStatementNode)
    }

    declarations() {
        // declarations : VAR (variable_declaration SEMI)+
        //              | empty

        let declarations = []
        if (this.currentToken.type === TokenType.VAR) {
            this.eat(TokenType.VAR)
            while (this.currentToken.type === TokenType.ID) {
                declarations = declarations.concat(this.variable_declaration())
                this.eat(TokenType.SEMI)
            }
        }
        return declarations
    }

    variable_declaration() {
        // variable_declaration : ID (COMMA ID)* COLON type_spec

        let varNodes = [new Var(this.currentToken)]
        this.eat(TokenType.ID)

        while (this.currentToken.type === TokenType.COMMA) {
            this.eat(TokenType.COMMA)
            varNodes.push(new Var(this.currentToken))
            this.eat(TokenType.ID)
        }

        this.eat(TokenType.COLON)

        let typeNode = this.type_spec()
        let varDeclarations = varNodes.map( vNode => new VarDecl(vNode, typeNode))

        return varDeclarations
    }

    type_spec() {
        // type_spec : INTEGER
        //           | REAL

        let token = this.currentToken
        if (token.type === TokenType.INTEGER) {
            this.eat(TokenType.INTEGER)
        } else if (token.type === TokenType.REAL) {
            this.eat(TokenType.REAL)
        } else {
            const expected = [
                TokenType.INTEGER,
                TokenType.REAL
            ]
            throw new Error(`Unmatched token; expected one of ${JSON.stringify(expected)} but got ${token.type}`)
        }

        return new Type(token)
    }

    compound_statement() {
        this.eat(TokenType.BEGIN)
        let nodes = this.statement_list()
        this.eat(TokenType.END)

        let root = new Compound()
        for (let i in nodes) {
            root.children.push(nodes[i])
        }

        return root
    }

    statement_list() {
        let node = this.statement()

        let results = [node]

        while (this.currentToken.type === TokenType.SEMI) {
            this.eat(TokenType.SEMI)
            results.push(this.statement())
        }

        return results
    }

    statement() {
        if (this.currentToken.type === TokenType.BEGIN) {
            return this.compound_statement()
        } else if (this.currentToken.type === TokenType.ID) {
            return this.assignment_statement()
        } else {
            return this.empty()
        }
    }

    assignment_statement() {
        let left = this.variable()
        let token = this.currentToken
        this.eat(TokenType.ASSIGN)
        let right = this.expr()

        return new Assign(token, left, right)
    }

    variable() {
        let node = new Var(this.currentToken)
        this.eat(TokenType.ID)
        return node
    }

    empty() {
        return new NoOp()
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken()
        } else {
            throw new Error(`Unmatched token: expected "${tokenType}" but got "${this.currentToken.type}"`)
        }
    }

    expr() {
        let result = this.term()

        while (this.currentToken.type === TokenType.PLUS || this.currentToken.type === TokenType.MINUS) {
            let token = this.currentToken

            if (token.type === TokenType.PLUS) {
                this.eat(TokenType.PLUS)
            } else if (token.type === TokenType.MINUS) {
                this.eat(TokenType.MINUS)
            } else {
                const expected = [
                    TokenType.PLUS,
                    TokenType.MINUS
                ]
                throw new Error(`Unmatched token: expected one of ${JSON.stringify(expected)} but got "${token.type}"`)
            }

            result = new BinOp(token, result, this.term())
        }

        return result
    }

    term() {
        // term : factor (( MUL | IDIV | DIV ) factor)*

        let result = this.factor()

        while (this.currentToken.type === TokenType.MUL || 
               this.currentToken.type === TokenType.DIV ||
               this.currentToken.type === TokenType.IDIV) {
            let token = this.currentToken

            if (token.type === TokenType.MUL) {
                this.eat(TokenType.MUL)
            } else if (token.type === TokenType.DIV) {
                this.eat(TokenType.DIV)
            } else if (token.type === TokenType.IDIV) {
                this.eat(TokenType.IDIV)
            } else {
                const expected = [
                    TokenType.MUL,
                    TokenType.DIV,
                    TokenType.IDIV
                ]
                throw new Error(`Unmatched token: expected one of ${JSON.stringify(expected)} but got "${token.type}"`)
            }

            result = new BinOp(token, result, this.factor())
        }

        return result
    }

    factor() {
        // factor : PLUS factor
        //        | MINUS factor
        //        | INTC
        //        | REALC
        //        | LPR expr RPR
        //        | variable

        let token = this.currentToken

        if (token.type === TokenType.PLUS) {
            this.eat(TokenType.PLUS)
            return new UnaryOp(token, this.expr())
        } if (token.type === TokenType.MINUS) {
            this.eat(TokenType.MINUS)
            return new UnaryOp(token, this.expr())
        } else if (token.type === TokenType.INTC) {
            this.eat(TokenType.INTC)
            return new Num(token)
        } else if (token.type === TokenType.REALC) {
            this.eat(TokenType.REALC)
            return new Num(token)
        } else if (token.type === TokenType.LPR) {
            this.eat(TokenType.LPR)
            let result = this.expr()
            this.eat(TokenType.RPR)
            return result
        } else {
            return this.variable()
        }
    }
};

module.exports = Parser