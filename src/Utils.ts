import vscode from "vscode";
import { exec as _exec, ExecOptions } from "child_process";
export function hasShebang(text: string): boolean {
  return text.startsWith("#!");
}

export function getTaggedTemplateInputs(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): [TemplateStringsArray, any[]] {
  return [strings, interpolations];
}

export function exec(
  command: string,
  options: ExecOptions = {}
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    _exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

export function getFirstLine(input: string) {
  return input.split("\n", 1)[0];
}

export function offsetSelection(
  selection: vscode.Selection,
  offsetLine: number
) {
  const newAnchor = new vscode.Position(
    selection.anchor.line + offsetLine,
    selection.anchor.character
  );
  const newActive = new vscode.Position(
    selection.active.line + offsetLine,
    selection.active.character
  );
  return new vscode.Selection(newAnchor, newActive);
}
