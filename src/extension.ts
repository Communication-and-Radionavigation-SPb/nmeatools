// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as nmea from "./checksum";
import * as helpers from "./helpers";
import SelectionResult from "./selection-result";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "nmeatools" is now active!');

  let calcTextboxDisposable = vscode.commands.registerCommand(
    "nmeatools.computeChecksum",
    async () => {
      const input = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt: "NMEA Sentence",
        title: "Calculate NMEA Checksum",
        placeHolder: "$IIHDT,41.0,T",
      });

      if (!input) {
        return;
      }

      if (!nmea.validate(input)) {
        vscode.window.showErrorMessage("Invalid NMEA Sentence!");
        return;
      }

      const checksum = nmea.calculateChecksum(input);

      vscode.window.showInformationMessage(
        "Result is: " + checksum.toString(16).padStart(2, "0").toUpperCase()
      );
    }
  );
  context.subscriptions.push(calcTextboxDisposable);

  let calcClipboardDisposable = vscode.commands.registerCommand(
    "nmeatools.computeChecksumClipboard",
    async () => {
      const clipboardContents = await vscode.env.clipboard.readText();

      if (!nmea.validate(clipboardContents)) {
        vscode.window.showErrorMessage("Invalid NMEA Sentence!");
        return;
      }

      const checksum: number = nmea.calculateChecksum(clipboardContents);

      vscode.window.showInformationMessage(
        "Result is: " + checksum.toString(16)
      );
    }
  );
  context.subscriptions.push(calcClipboardDisposable);

  let calcSelectionDisposable = vscode.commands.registerCommand(
    "nmeatools.computeChecksumSelection",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No file opened, nothing to select :(");
        return;
      }
      
      const selections = activeEditor.selections;
      selections.forEach((selection) => {
        let results: SelectionResult = new SelectionResult();

        for (let linenum = selection.start.line; linenum <= selection.end.line; linenum++) {
          const lineContents = activeEditor.document.lineAt(linenum).text;
          
          if (!nmea.validate(lineContents)) {
            results.addBad(linenum, "Invalid NMEA Sentence!");
            continue;
          }
          
          results.addGood(linenum, nmea.calculateChecksum(lineContents));
        }

        vscode.window.showInformationMessage(
          helpers.formSelectionReport(results), { modal: true }
        );
      });
    }
  );
  context.subscriptions.push(calcSelectionDisposable);

  let calcCurrentLineDisposable = vscode.commands.registerCommand(
    "nmeatools.computeChecksumCurrentLine",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No file opened, nothing to select :(");
        return;
      }
      
      const currentPos = activeEditor.selection.active;
      const lineContents = activeEditor.document.lineAt(currentPos).text;

      if (!nmea.validate(lineContents)) {
        vscode.window.showErrorMessage("Invalid NMEA Sentence!");
        return;
      }

      const checksum: number = nmea.calculateChecksum(lineContents);

      vscode.window.showInformationMessage(
        "Result is: " + checksum.toString(16)
      );
    }
  );
  context.subscriptions.push(calcCurrentLineDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
