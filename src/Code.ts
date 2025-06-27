class Code {
    private address: number;

    constructor() {
        this.address = 0;
    }

    static dest(mnemonic: string): string {
        if (mnemonic === "null") {
            return "000";
        }
        let a = mnemonic.includes("A") ? "1" : "0";
        let d = mnemonic.includes("D") ? "1" : "0";
        let m = mnemonic.includes("M") ? "1" : "0";
        return a + d + m;
    }
}