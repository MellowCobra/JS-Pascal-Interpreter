const {
    Symbol,
    BuiltinTypeSymbol,
    VarSymbol
} = require('./symbol')

class SymbolTable {
    constructor() {
        this._symbols = new Map()
        this.initBuiltinSymbols()
    }

    initBuiltinSymbols() {
        const builtinTypes = [
            "INTEGER",
            "REAL"
        ]
        builtinTypes.forEach( type => this.define( new BuiltinTypeSymbol(type) ) )
    }

    toString() {
        const symbols = []
        this._symbols.forEach( entry => {
            symbols.push(entry)
        })
        return "Symbols: " + symbols.join(', ')
    }

    define(symbol) {
        this._symbols.set(symbol.name, symbol)
        console.log(`Define ${symbol}: ${this._symbols.get(symbol.name)}`)
    }

    lookup(name) {
        const res = this._symbols.get(name)
        console.log(`Lookup ${name}: ${res}`)
        return res
    }
}

module.exports = SymbolTable