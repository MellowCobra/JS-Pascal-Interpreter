const Lexer = require('./lexer')
const Token = require('./token')
const TokenType = require('./tokenType')
const { AST, BinOp, UnaryOp, Num } = require('./ast')

class Parser {
    constructor(program) {
        this.lexer = new Lexer(program)
        this.currentToken = this.lexer.getNextToken()
    }

    parse() {
        return this.expr()
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

        while (this.currentToken.type === TokenType.MUL || this.currentToken.type === TokenType.DIV) {
            let token = this.currentToken

            if (token.type === TokenType.MUL) {
                this.eat(TokenType.MUL)
            } else if (token.type === TokenType.DIV) {
                this.eat(TokenType.DIV)
            } else {
                const expected = [
                    TokenType.MUL,
                    TokenType.DIV
                ]
                throw new Error(`Unmatched token: expected one of ${JSON.stringify(expected)} but got "${token.type}"`)
            }

            result = new BinOp(token, result, this.factor())
        }

        return result
    }

    factor() {
        let token = this.currentToken

        if (token.type === TokenType.PLUS || token.type === TokenType.MINUS) {
            if (token.type === TokenType.PLUS) {
                this.eat(TokenType.PLUS)
            } else if (token.type === TokenType.MINUS) {
                this.eat(TokenType.MINUS)
            }

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
            throw new Error(`Unmatched token: expected ${TokenType.INT} but got ${token.type}`)
        }
    }
};

module.exports = Parser