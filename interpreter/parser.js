const Lexer = require('./lexer')
const Token = require('./token')
const TokenType = require('./tokenType')

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

            let right = this.term()
            if (token.type === TokenType.PLUS) {
                result += right
            } else if (token.type === TokenType.MINUS) {
                result -= right
            }
        }

        return result
    }

    term() {
        let result = this.power()

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

            let right = this.power()
            if (token.type === TokenType.MUL) {
                result *= right
            } else if (token.type === TokenType.DIV) {
                result /= right
            }
        }

        return result
    }

    power() {
        let result = this.factor()

        while(this.currentToken.type === TokenType.POW) {
            let token = this.currentToken
            this.eat(TokenType.POW)
            let right = this.factor()

            result = Math.pow(result, right)
        }

        return result
    }

    factor() {
        let token = this.currentToken

        if (token.type === TokenType.INT) {
            this.eat(TokenType.INT)
            return token.value
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