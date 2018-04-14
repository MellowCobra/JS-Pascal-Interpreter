const NULLCHAR = '\0'

const Token = require("./token.js")
const TokenType = require("./tokenType")

String.prototype.isNumeric = function() {
    return !isNaN(parseInt(this, 10))
}

String.prototype.isWhitespace = function() {
    return this.trim() === ''
}

class Lexer {
    constructor(program) {
        this.text = program || ""
        this.position = 0
        this.currentChar = this.text.length > 0 ? this.text[this.position] : NULLCHAR
    }

    advance() {
        this.position++

        if (this.position >= this.text.length) {
            this.currentChar = NULLCHAR
        } else {
            this.currentChar = this.text[this.position]
        }
    }

    getNextToken() {
        while (this.currentChar != NULLCHAR) {
            if (this.currentChar.isNumeric()) {
                return new Token(TokenType.INT, this.integer())
            } else if (this.currentChar.isWhitespace()) {
                this.skipWhitespace()
            } else if (this.currentChar === '+') {
                this.advance()
                return new Token(TokenType.PLUS)
            } else if (this.currentChar === '-') {
                this.advance()
                return new Token(TokenType.MINUS)
            } else if (this.currentChar === '*') {
                this.advance()
                return new Token(TokenType.MUL)
            } else if (this.currentChar === '/') { 
                this.advance()
                return new Token(TokenType.DIV)
            // } else if (this.currentChar === '^') {
            //     this.advance()
            //     return new Token(TokenType.POW)
            } else if (this.currentChar === '(') {
                this.advance()
                return new Token(TokenType.LPR)
            } else if (this.currentChar === ')') {
                this.advance()
                return new Token(TokenType.RPR)
            } else {
                throw new Error(`Unknown token "${this.currentChar}" at position ${this.position}`)
            }
        }

        return new Token(TokenType.EOF)
    }

    integer() {
        let value = ""
        while (this.currentChar != NULLCHAR && this.currentChar.isNumeric()) {
            value += this.currentChar
            this.advance()
        }

        return parseInt(value,10)
    }

    skipWhitespace() {
        while (this.currentChar != NULLCHAR && this.currentChar.isWhitespace()) {
            this.advance()
        }
    }
};

module.exports =  Lexer