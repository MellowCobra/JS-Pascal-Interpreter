Terminals:
* BEGIN `BEGIN`
* END `END` 
* PLUS `+`
* MINUS `-`
* MUL `*`
* DIV `/`
* LPR `(`
* RPR `)`
* INT `[0..9]*`
* DOT `.`
* SEMI `;`
* ASSIGN `:=`
* ID `aWordLikeThis2`
* EOF `\0`

Grammar:

    program                 : compound_statement DOT

    compound_statement      : statement
                            | statement SEMI statement_list

    statement               : compound_statement
                            | assignment_statement
                            | empty

    assignment              : variable ASSIGN expr

    empty                   :

    expr                    : term ((PLUS|MINUS) term)*

    term                    : factor ((MUL|DIV) factor)*

    factor                  : PLUS expr
                            | MINUS expr
                            | INT
                            | LPR expr RPR
                            | variable
