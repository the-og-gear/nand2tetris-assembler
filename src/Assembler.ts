import path from "path";
import { COMMAND_TYPE, Parser } from "./Parser";
import { Code } from "./Code";
import { appendFileSync, writeFileSync } from "fs";
import { SymbolTable } from "./SymbolTable";

export function Assemble(opts: any) {
    // Create a parser instance
    let parser = new Parser(path.join(__dirname, "test.asm"));

    // Clear the output .hack file
    writeFileSync(path.join(__dirname, "test.hack"), "");

    // Create a new symbol table and initialize the ROM address
    let symbolTable = new SymbolTable();
    let romAddress = 0;

    // Assembler first past - parse the file to find any labels, add them to the symbol table.
    if (!opts.quiet)
        console.log("First pass...");
    while (parser.hasMoreCommands()) {
        parser.advance();
        switch (parser.commandType()) {
            // Skip A_ and C_ commands unless debug output is enabled
            case COMMAND_TYPE.A_COMMAND:
                if (opts.debug)
                    console.log(`[${romAddress}] A_COMMAND: ${parser.symbol()}`);
                romAddress++;
                break;
            case COMMAND_TYPE.C_COMMAND:
                if (opts.debug)
                    console.log(`[${romAddress}] C_COMMAND: dest - ${parser.dest()}, comp - ${parser.comp()}, jump - ${parser.jump()}`);
                romAddress++;
                break;
            // For every L command, add the label to the symbol table with the romAddress of the NEXT command
            case COMMAND_TYPE.L_COMMAND:
                if (opts.debug)
                    console.log(`[--${romAddress}--] L_COMMAND: ${parser.symbol()}`);
                symbolTable.addEntry(parser.symbol(), romAddress);
                break;
        }
    }

    if (opts.symbols) {
        // If the --symbols option is set, output the symbol table to the console
        console.log("Symbol Table:");
        const symbols = symbolTable.getSymbols();
        for (const [symbol, address] of Object.entries(symbols)) {
            console.log(`${symbol}: ${address}`);
        }
        return; // Exit after printing the symbol table
    }

    // Reset the parser for the second pass
    parser.reset();
    if (!opts.quiet)
        console.log("Second pass...");
    while (parser.hasMoreCommands()) {
        parser.advance();
        switch(parser.commandType()) {
            // For A commands, either write the address of a symbol or the given number to the output file
            case COMMAND_TYPE.A_COMMAND:
                if (parser.symbol().match(/^\d+$/)) {
                    // If the symbol is a number, convert it to binary
                    const address = parseInt(parser.symbol());
                    appendFileSync(path.join(__dirname, "test.hack"), address.toString(2).padStart(16, '0') + "\n");
                } else {
                    // If the symbol is a variable, get its address from the symbol table
                    const address = symbolTable.GetAddress(parser.symbol());
                    appendFileSync(path.join(__dirname, "test.hack"), address.toString(2).padStart(16, '0') + "\n");
                }
                break;
            // For C commands, write the given instruction to the output file
            case COMMAND_TYPE.C_COMMAND:
                appendFileSync(path.join(__dirname, "test.hack"), "111" +
                    Code.comp(parser.comp()) +
                    Code.dest(parser.dest()) +
                    Code.jump(parser.jump()) + "\n");
                break;
            // Do not process L commands, they're already handled during the first pass
            case COMMAND_TYPE.L_COMMAND:
                break;
        }
    }
    if (!opts.quiet)
        console.log("Assembly complete.");
}