export class SymbolTable {
    private symbols: { [key: string]: number } = {};
    private nextAddress: number = 16;

    constructor() {
        // Predefined symbols
        const predefinedSymbols = { 
            SP: 0,
            LCL: 1,
            ARG: 2,
            THIS: 3,
            THAT: 4,
            R0: 0,
            R1: 1,
            R2: 2,
            R3: 3,
            R4: 4,
            R5: 5,
            R6: 6,
            R7: 7,
            R8: 8,
            R9: 9,
            R10: 10,
            R11: 11,
            R12: 12,
            R13: 13,
            R14: 14,
            R15: 15,
            SCREEN: 16384,
            KBD: 24576
        };
        for (const [key, value] of Object.entries(predefinedSymbols)) {
            this.addEntry(key, value);
        }
    }

    addEntry(symbol: string, address: number): void {
        if (!this.contains(symbol)) {
            this.symbols[symbol] = address;
        }
    }

    contains(symbol: string): boolean {
        return symbol in this.symbols;
    }

    GetAddress(symbol: string): number {
        if (this.contains(symbol)) {
            return this.symbols[symbol];
        } else {
            // If the symbol is not found, assign it a new address
            this.addEntry(symbol, this.nextAddress);
            return this.nextAddress++;
        }
    }

    // HELPER
    getSymbols(): { [key: string]: number } {
        return this.symbols;
    }
    // END HELPER
}