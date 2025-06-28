import path from "path";
import { COMMAND_TYPE, Parser } from "./Parser";
import { Code } from "./Code";
import { appendFileSync, writeFileSync } from "fs";

let parser = new Parser(path.join(__dirname, "test.asm"));
writeFileSync(path.join(__dirname, "test.hack"), "");
while (parser.hasMoreCommands()) {
    parser.advance();
    switch (parser.commandType()) {
        case COMMAND_TYPE.A_COMMAND:
            console.log("A_COMMAND: " + parser.symbol());
            console.log("Binary: " + parseInt(parser.symbol()).toString(2).padStart(16, '0'));
            appendFileSync(path.join(__dirname, "test.hack"), parseInt(parser.symbol()).toString(2).padStart(16, '0') + "\n");
            break;
        case COMMAND_TYPE.C_COMMAND:
            console.log("C_COMMAND: " + parser.comp() + " " + parser.dest() + " " + parser.jump());
            console.log("Binary: 111 " + 
                Code.comp(parser.comp()) + " " + 
                Code.dest(parser.dest()) + " " + 
                Code.jump(parser.jump()));
            appendFileSync(path.join(__dirname, "test.hack"), "111" + Code.comp(parser.comp()) + Code.dest(parser.dest()) + Code.jump(parser.jump()) + "\n");
            break;
        case COMMAND_TYPE.L_COMMAND:
            console.log("L_COMMAND: " + parser.symbol());
            break;
    }
}