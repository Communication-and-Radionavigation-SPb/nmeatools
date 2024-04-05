class LineResult {
    constructor(linenum: number, contents: number | string) {
        this.linenum = linenum;
        this.result = contents;
    }

    linenum: number;
    result: number | string;
};

export default class SelectionResult {
    constructor() {
        this.bad = [];
        this.good = [];
    }

    addGood(linenum: number, result: number | string): void {
        this.good.push(new LineResult(linenum, result));
    }

    addBad(linenum: number, reason: string): void {
        this.bad.push(new LineResult(linenum, reason));
    }

    bad: LineResult[];    
    good: LineResult[];
};