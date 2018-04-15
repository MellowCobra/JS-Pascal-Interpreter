const Parser = require('./interpreter/parser')
const Interpreter = require('./interpreter')

const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

process.stdout.write(">>> ")

rl.on("line", line => {
    if (line.toLowerCase() === "quit") {
        rl.close()
    } else if (line.toLowerCase() === "help") {
        console.log("This is a super simple REPL for my JS interpreter.")
        console.log("Enter a simple program with only statement blocks and basic variable assignments with integer expressions")
        console.log("For example: 'BEGIN a := 3 + -5; b := 42; c := a * (b + 35 / 7) END.'")
        console.log("Or you can quit with the command 'quit'")
        process.stdout.write(">>> ")
    } else {
        // let parser = new Parser(line)
        // let result = parser.parse()

        // console.log(JSON.stringify(result, null, 4))

        let interpreter = new Interpreter(line)
        result = interpreter.interpret()
    
        console.log("Symbol table:", JSON.stringify(interpreter.GLOBAL_SCOPE, null, 4))
        process.stdout.write(">>> ")
    }
})

rl.on("close", () => {
    process.exit()
})