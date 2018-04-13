const Parser = require('./interpreter/parser')

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
        let parser = new Parser(line)
        let result = parser.parse()
    
        console.log(result)
        process.stdout.write(">>> ")
    }
})

rl.on("close", () => {
    process.exit()
})