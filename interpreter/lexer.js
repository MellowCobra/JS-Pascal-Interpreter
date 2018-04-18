const NULLCHAR = '\0'

const Token = require("./token.js")
const TokenType = require("./tokenType")

String.prototype.isNumeric = function() {
    return !isNaN(parseInt(this, 10))
}

String.prototype.isAlphabetic = function() {
    let alphaCheck = /^[a-zA-Z_]+$/g
    return alphaCheck.test(this)
}

String.prototype.isAlphanumeric = function() {
    return this.isNumeric() || this.isAlphabetic()
}

String.prototype.isWhitespace = function() {
    return this.trim() === ''
}

const Reserved = {
    "PROGRAM": new Token(TokenType.PROGRAM, "PROGRAM"),
    "VAR": new Token(TokenType.VAR, "VAR"),
    "DIV": new Token(TokenType.IDIV, "DIV"),
    "INTEGER": new Token(TokenType.INTEGER, "INTEGER"),
    "REAL": new Token(TokenType.REAL, "REAL"),
    "BEGIN": new Token(TokenType.BEGIN, "BEGIN"),
    "END": new Token(TokenType.END, "END"),
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
                return this.number()
            } else if (this.currentChar.isAlphabetic()) {
                return this._id()
            } else if (this.currentChar.isWhitespace()) {
                this.skipWhitespace()
            } else if (this.currentChar === '{') {
                this.advance()
                this.skipComment()
                continue
            } else if (this.currentChar === ':' && this.peek() === '=') {
                this.advance()
                this.advance()
                return new Token(TokenType.ASSIGN, ":=")
            } else if (this.currentChar === ':') {
                this.advance()
                return new Token(TokenType.COLON, ":")
            } else if (this.currentChar === ',') {
                this.advance()
                return new Token(TokenType.COMMA, ",")
            } else if (this.currentChar === '+') {
                this.advance()
                return new Token(TokenType.PLUS, "+")
            } else if (this.currentChar === '-') {
                this.advance()
                return new Token(TokenType.MINUS, "-")
            } else if (this.currentChar === '*') {
                this.advance()
                return new Token(TokenType.MUL, "*")
            } else if (this.currentChar === '/') { 
                this.advance()
                return new Token(TokenType.DIV, "/")
            } else if (this.currentChar === '(') {
                this.advance()
                return new Token(TokenType.LPR, "(")
            } else if (this.currentChar === ')') {
                this.advance()
                return new Token(TokenType.RPR, ")")
            } else if (this.currentChar === ';') {
                this.advance()
                return new Token(TokenType.SEMI, ";")
            } else if (this.currentChar === '.') {
                this.advance()
                return new Token(TokenType.DOT, ".")
            } else {
                throw new Error(`Unknown token "${this.currentChar}" at position ${this.position}`)
            }
        }

        return new Token(TokenType.EOF)
    }

    _id() {
        let identifier = ""
        while (this.currentChar !== NULLCHAR && this.currentChar.isAlphanumeric()) {
            identifier += this.currentChar
            this.advance()
        }

        identifier = identifier.toUpperCase()

        if (Reserved[identifier] != null) {
            return Reserved[identifier]
        }

        return new Token(TokenType.ID, identifier)
    }

    number() {
        let value = ""
        while (this.currentChar !== NULLCHAR && this.currentChar.isNumeric()) {
            value += this.currentChar
            this.advance()
        }

        if (this.currentChar === '.') {
            value += this.currentChar
            this.advance()

            while (this.currentChar !== NULLCHAR && this.currentChar.isNumeric()) {
                value += this.currentChar
                this.advance()
            }

            return new Token(TokenType.REALC, parseFloat(value))
        }

        return new Token(TokenType.INTC, parseInt(value,10))
    }

    skipWhitespace() {
        while (this.currentChar != NULLCHAR && this.currentChar.isWhitespace()) {
            this.advance()
        }
    }

    skipComment() {
        while (this.currentChar !== '}') {
            this.advance()
        }
        this.advance()
    }

    peek() {
        let peekAt = this.position + 1
        if (peekAt >= this.text.length) {
            return null
        } else {
            return this.text[peekAt]
        }
    }
};

module.exports =  Lexer