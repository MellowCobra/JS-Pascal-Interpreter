# JS Pascal Interpreter
> Lightweight interpreter for Pascal written in JavaScript

WIP: Currently processes simple programs according to the grammar defined in [CFG.md](https://github.com/MellowCobra/JS-Pascal-Interpreter/blob/master/CFG.md)

`main.js` runs a basic REPL that can take simple programs on a single line, parse and interpret them, and print the end contents of the symbol table if there are no errors.

Most errors are caught by the lexer and the parser. Feel free to open up an issue if you find some errors that I do not report accurately.

## Usage:
* Run the REPL with `node main.js`
* Ask the REPL what it can do with `help`.
* Exit the REPL with `quit`
