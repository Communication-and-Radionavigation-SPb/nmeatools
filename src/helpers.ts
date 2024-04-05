import { isNumberObject } from "util/types";
import "./selection-result";
import SelectionResult from "./selection-result";

export function formSelectionReport(result: SelectionResult): string {
    let report: string = "";
    result.good.forEach(goodResult => {
        report = report.concat(`✅ Line ${goodResult.linenum}: ${goodResult.result?.toString(16).toUpperCase()}\n`);
    });

    result.bad.forEach(badResult => {
        report = report.concat(`❌ Line ${badResult.linenum}: ${badResult.result}\n`);
    });

    return report;
}