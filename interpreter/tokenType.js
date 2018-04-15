const TokenType = {
    BEGIN: 'BEGIN',
    END: 'END',
    PLUS: '+',
    MINUS: '-',
    MUL: '*',
    DIV: '/',
    IDIV: 'DIV',
    // POW: '^',
    LPR: '(',
    RPR: ')',
    INT: 'int',
    DOT: '.',
    SEMI: ';',
    ASSIGN: ':=',
    ID: 'id',
    EOF: '\0',
}

module.exports = TokenType