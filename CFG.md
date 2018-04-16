Terminals:
* PROGRAM `PROGRAM`
* BEGIN `BEGIN`
* END `END` 
* VAR `VAR`
* PLUS `+`
* MINUS `-`
* MUL `*`
* DIV `/`
* IDIV `DIV`
* LPR `(`
* RPR `)`
* INTEGER `INTEGER`
* REAL `REAL`
* INTC `[0..9]*`
* REALC `[0..9]*\.[0..9]*`
* DOT `.`
* COMMA `,`
* SEMI `;`
* COLON `:`
* ASSIGN `:=`
* ID `aWordLikeThis2`
* EOF `\0`

Grammar:

    
    program                 : PROGRAM variable SEMI block DOT

    block                   : declarations compound_statements

    declarations            : VAR (variable_declaration SEMI)+
                            : empty

    variable_declarations   : ID (COMMA ID)* COLON type_spec

    type_spec               : INTEGER
                            | REAL

    compound_statement      : statement
                            | statement SEMI statement_list

    statement               : compound_statement
                            | assignment_statement
                            | empty

    assignment              : variable ASSIGN expr

    empty                   :

    expr                    : term ((PLUS|MINUS) term)*

    term                    : factor ((MUL| IDIV | DIV) factor)*

    factor                  : PLUS factor
                            | MINUS factor
                            | INTC
                            | REALC
                            | LPR expr RPR
                            | variable

    variable                | ID
