import { existsSync } from "fs";
import path from "path";
import { Assemble } from "./Assembler";

const optionDefs = [
    {name: 'quiet', alias: 'q', type: Boolean, description: 'Suppresses all output except errors.'},
    {name: 'help', alias: 'h', type: Boolean, description: 'Displays package help.'},
    {name: 'debug', alias: 'd', type: Boolean, description: 'Enables debug output. Will show all commands, their types and their ROM addresses.'},
    {name: 'symbols', alias: 's', type: Boolean, description: 'Outputs the symbol table to the console. Only performs the first pass and does not modify the output file(s).'},
    {name: 'output', alias: 'o', type: String, description: 'Specifies the output file name. Defaults to "test.hack" if not provided.'},
    {name: 'input', alias: 'i', type: String, description: 'Specifies the input file name. Defaults to "test.asm" if not provided.'}
]

const options = require('command-line-args')(optionDefs);

let valid = true;
if (options.help) {
    console.log("Usage: node main.js [options]");
    console.log("Options:");
    optionDefs.forEach(opt => {
        console.log(`  --${opt.name}, -${opt.alias} : ${opt.description}`);
    });
    process.exit(0);
}

if (options.quiet && (options.debug || options.symbols))
    valid = false;
if (!existsSync(path.join(__dirname, (options.input || "test.asm"))))
    valid = false;


if (!valid) {
    console.error("Invalid options provided. Use --help to see available options.");
    process.exit(1);
}

Assemble(options);