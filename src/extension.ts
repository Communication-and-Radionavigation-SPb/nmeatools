// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as nmea from "./checksum";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "nmeatools" is now active!');

  let calcTextboxDisposable = vscode.commands.registerCommand(
    "nmeacalc.computeChecksum",
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
      }

      const checksum = nmea.calculateChecksum(input);

      vscode.window.showInformationMessage(
        "Result is: " + checksum.toString(16).padStart(2, "0").toUpperCase()
      );
    }
  );
  context.subscriptions.push(calcTextboxDisposable);

  let calcClipboardDisposable = vscode.commands.registerCommand(
    "nmeacalc.computeChecksumClipboard",
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
}

// This method is called when your extension is deactivated
export function deactivate() {}
