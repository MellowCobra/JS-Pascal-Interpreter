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
        return `<BuiltinTypeSymbol ${this.name}>`
    }
}

class VarSymbol extends Symbol {
    constructor(name, type) {
        super(name, type)
    }

    toString() {
        return `<VarSymbol ${this.name}: ${this.type.name}>`
    }
}

class ProcedureSymbol extends Symbol {
    constructor(name, params) {
        super(name)
        this.params = params || []
    }

    toString() {
        return `<ProcedureSymbol ${this.name} (${this.params.join(', ')})>`
    }
}

module.exports = {
    Symbol,
    BuiltinTypeSymbol,
    VarSymbol,
    ProcedureSymbol
}