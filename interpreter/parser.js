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
    NoOp
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
        let node = this.compound_statement()
        this.eat(TokenType.DOT)
        return node
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
        let token = this.currentToken

        if (token.type === TokenType.PLUS) {
            this.eat(TokenType.PLUS)
            return new UnaryOp(token, this.expr())
        } if (token.type === TokenType.MINUS) {
            this.eat(TokenType.MINUS)
            return new UnaryOp(token, this.expr())
        } else if (token.type === TokenType.INT) {
            this.eat(TokenType.INT)
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