class Symbol {
    constructor(name, type) {
        this.name = name
        this.type = type || null
    }
}

class BuiltinTypeSymbol extends Symbol {
    constructor(name) {
        super(name)
    }

    toString() {
        return this.name
    }
}

class VarSymbol extends Symbol {
    constructor(name, type) {
        super(name, type)
    }

    toString() {
        return `<${this.name}:${this.type}>`
    }
}

module.exports = {
    Symbol,
    BuiltinTypeSymbol,
    VarSymbol
}