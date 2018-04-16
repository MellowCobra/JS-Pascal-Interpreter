const TokenType = {
    PROGRAM: 'PROGRAM',
    BEGIN: 'BEGIN',
    END: 'END',
    VAR: 'VAR',
    PLUS: '+',
    MINUS: '-',
    MUL: '*',
    DIV: '/',
    IDIV: 'DIV',
    LPR: '(',
    RPR: ')',
    INTEGER: 'INTEGER',
    REAL: 'REAL',
    INTC: 'int',
    REALC: 'real',
    DOT: '.',
    COMMA: ',',
    SEMI: ';',
    COLON: ':',
    ASSIGN: ':=',
    ID: 'id',
    EOF: '\0',
}

module.exports = TokenType