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
        console.log("type in an integer arithmetic expression, or 'quit' to exit")
        process.stdout.write(">>> ")
    } else {
        // let parser = new Parser(line)
        // let result = parser.parse()

        // console.log(JSON.stringify(result, null, 4))

        let interpreter = new Interpreter(line)
        result = interpreter.interpret()
    
        console.log(interpreter.GLOBAL_SCOPE)
        process.stdout.write(">>> ")
    }
})

rl.on("close", () => {
    process.exit()
})