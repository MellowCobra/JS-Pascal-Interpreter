# JS Pascal Interpreter
> Lightweight interpreter for Pascal written in JavaScript

WIP: Currently processes simple programs according to the grammar defined in [CFG.md](https://github.com/MellowCobra/JS-Pascal-Interpreter/blob/master/CFG.md)

This Interpreter was built as a learning exercise following Ruslan Spivak's [Let's Build a Simple Interpreter](https://ruslanspivak.com/lsbasi-part1/) series.

`repl.js` runs a basic REPL that can take simple programs on a single line, and parse and interpret them.

`main.js` takes the relative path of the program input file as a command-line argument, and parses and interprets it.

Upon a successful parsing, the constructed AST of the program is printed out, followed by the end contents of the Symbol Table, and the GLOBAL_SCOPE of the interpreter.

Most errors are caught by the lexer and the parser. Feel free to open up an issue if you find some errors that I do not report accurately.

## Installation
* Install using npm: `npm install --global pascal-interpreter`
* Alias the interpreter: `alias pascaljs="node /path/to/global/node_modules/pascal-interpreter/main.js"`
* Alias the REPL: `alias pascaljs-repl="node /path/to/global/node_modules/pascal-interpreter/repl.js"`
> Note: the path to the global node modules will be printed to the console after running the install

## Usage:
### If in the source directory:
* Run the REPL with `node repl.js`
* Ask the REPL what it can do with `help`.
* Exit the REPL with `quit`
Or
* Interpret a .pas program file with `node main.js <filename.pas>`
### If aliased:
* Run the REPL with `pascaljs-repl`
* Interpret a .pas program file with `pascaljs <filename.pas>`
