import { closeSync, openSync, readFileSync } from "node:fs";

export enum COMMAND_TYPE {
    A_COMMAND,
    C_COMMAND,
    L_COMMAND
}

/**
 * Parser class for handling file parsing operations.
 */
export class Parser {
    //==============================================================================
    private data: string[];
    /**
     * Creates a new Parser instance.
     * @param input - The path to the file to be parsed.
     */
    constructor(private input: string) {
        let fileHandler = openSync(input, 'r');
        this.data = readFileSync(fileHandler, 'utf8').split('\n');
        closeSync(fileHandler);
    }
    //==============================================================================

    private currentCommand: string = "";
    private commandIndex: number = 0;
    /**
     * Checks if there are more commands to parse in the file.
     * This method should be called before calling advance().
     * @returns True if there are more commands, false otherwise.
     */
    hasMoreCommands(): boolean {
        return this.commandIndex < this.data.length;
    }

    /**
     * Advances the parser to the next command in the file.
     * This method should be called after hasMoreCommands() returns true.
     */
    advance(): void {
        if (this.hasMoreCommands()) {
            this.currentCommand = this.data[this.commandIndex++].trim();
            if (this.currentCommand.startsWith("//") || this.currentCommand === "") {
                // Skip comments and empty lines
                this.advance();
            }
        }
    }

    /**
     * Returns the type of the current command.
     * Should only be called after hasMoreCommands() returns true.
     * @returns The type of the current command as a COMMAND_TYPE enum value.
     */
    commandType(): COMMAND_TYPE {
        if (this.currentCommand.startsWith("@")) {
            return COMMAND_TYPE.A_COMMAND;
        } else if (this.currentCommand.startsWith("(") && this.currentCommand.endsWith(")")) {
            return COMMAND_TYPE.L_COMMAND;
        }
        return COMMAND_TYPE.C_COMMAND;
    }

    /**
     * Returns the symbol or decimal Xxx of the current command @Xxx or (Xxx).
     * Should only be called if the command type is A_COMMAND or L_COMMAND.
     * @returns The symbol in the current A-command or L-command.
     */
    symbol(): string {
        if (this.commandType() === COMMAND_TYPE.A_COMMAND) {
            return this.currentCommand.slice(1).trim(); // Remove '@' and trim whitespace
        } else if (this.commandType() === COMMAND_TYPE.L_COMMAND) {
            return this.currentCommand.slice(1, -1).trim(); // Remove '(' and ')' and trim whitespace
        }
        throw new Error("Current command is not an A_COMMAND or L_COMMAND.");
    }

    /**
     * Returns the destination mnemonic in the current C-command.
     * Should only be called if the command type is C_COMMAND.
     * @returns The destination part of the current command.
     */
    dest(): string {
        if (this.commandType() !== COMMAND_TYPE.C_COMMAND) {
            throw new Error("Current command is not a C_COMMAND.");
        }
        const keywords = this.currentCommand.split('='); // Split by '='
        if (keywords.length > 1) {
            return this.currentCommand.split('=')[0].split(";")[0].trim(); // Return "null" if no dest part
        } else {
            return "null";
        }
    }

    /**
     * Returns the computation mnemonic in the current C-command.
     * Should only be called if the command type is C_COMMAND.
     * @returns The computation part of the current command.
     */
    comp(): string {
        if (this.commandType() !== COMMAND_TYPE.C_COMMAND) {
            throw new Error("Current command is not a C_COMMAND.");
        }
        const compPart = this.currentCommand.split('=')[1] || this.currentCommand; // Get part after '=' or the whole command
        return compPart.split(';')[0].trim(); // Return part before ';' and trim whitespace
    }

    /**
     * Returns the jump mnemonic in the current C-command. Should only be called
     * if the command type is C_COMMAND.
     * @returns The jump part from the current command.
     */
    jump(): string {
        if (this.commandType() !== COMMAND_TYPE.C_COMMAND) {
            throw new Error("Current command is not a C_COMMAND.");
        }
        return this.currentCommand.split(';')[1] || "null"; // Get part after ';'
    }

    /**
     * Resets the parser to the initial state.
     * This method clears the current command and resets the command index.
     */
    reset(): void {
        this.commandIndex = 0;
        this.currentCommand = "";
    }
}