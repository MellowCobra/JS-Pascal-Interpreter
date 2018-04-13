Terminals: 
* PLUS `+`
* MINUS `-`
* MUL `*`
* DIV `/`
* POW `^`
* LPR `(`
* RPR `)`
* INT `[0..9]*`
* EOF `\0`

Grammar:

    expr    : term ((PLUS|MINUS) term)*
    term    : power ((MUL|DIV) power)*
    power   : factor (POW factor)*
    factor  : INT
            | LPR expr RPR
