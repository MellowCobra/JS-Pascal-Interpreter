if (process.argv.length < 3) {
    console.log("Usage: node main.js <input_file_name>")
    process.exit()
}

const inFileName = process.argv[2]
const fs = require('fs')
const program = fs.readFileSync(__dirname + "/" + inFileName, { encoding: 'utf8'})

const Parser = require('./interpreter/parser')
const { SemanticAnalyzer, Interpreter } = require('./interpreter')

let parser = new Parser(program)
let result = parser.parse()

console.log(JSON.stringify(result, null, 4))

let semAnalyzer = new SemanticAnalyzer()
semAnalyzer.visit(result)

let interpreter = new Interpreter(program)
result = interpreter.interpret()

console.log("Run-time GLOBAL_MEMORY contents:", JSON.stringify(interpreter.GLOBAL_SCOPE, null,4))

process.exit()