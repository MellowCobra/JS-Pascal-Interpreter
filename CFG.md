Terminals: 
* PLUS `+`
* MINUS `-`
* MUL `*`
* DIV `/`
* LPR `(`
* RPR `)`
* INT `[0..9]*`
* EOF `\0`

Grammar:

    expr    : term ((PLUS|MINUS) term)*
    term    : factor ((MUL|DIV) factor)*
    factor  : (PLUS|MINUS) expr
            | INT
            | LPR expr RPR
