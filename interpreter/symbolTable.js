const {
    Symbol,
    BuiltinTypeSymbol,
    VarSymbol
} = require('./symbol')

class ScopedSymbolTable {
    constructor(name, level, parent) {
        this._symbols = new Map()
        this.scopeName = name
        this.scopeLevel = level
        this.enclosingScope = parent || null
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
        return `\n\nScope (Scoped Symbol Table) 
Scope Name: ${this.scopeName}
Scope Level: ${this.scopeLevel}
Enclosing Scope: ${ this.enclosingScope ? this.enclosingScope.scopeName : "None" }
Scope contents: 
    ${symbols.join(',\n    ')}\n\n`
    }

    define(symbol) {
        this._symbols.set(symbol.name, symbol)
        console.log(`Define ${symbol}`)
    }

    contains(name) {
        return this._symbols.has(name)
    }

    lookup(name) {
        const symbol = this._symbols.get(name)
        console.log(`Lookup ${name} in scope ${this.scopeName}: ${symbol}`)

        if (symbol != null) {
            return symbol
        } else if (this.enclosingScope != null) {
            return this.enclosingScope.lookup(name)
        }

        return null
    }
}

module.exports = ScopedSymbolTable