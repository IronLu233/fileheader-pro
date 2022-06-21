import vscode from "vscode";
import { ChildProcess, exec as _exec, ExecOptions } from "child_process";
import { CommandExecError } from "./Error/CommandExecError";
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
): Promise<string> & { handler: ChildProcess | null } {
  let handler: ChildProcess | null = null;
  const p = new Promise<string>((resolve, reject) => {
    handler = _exec(command, options, (error, stdout, stderr) => {
      if (stderr || error) {
        reject(new CommandExecError(stderr, stdout, error));
      } else {
        resolve(stdout);
      }
    });
  }) as Promise<string> & { handler: ChildProcess | null };

  p.handler = handler;
  return p;
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

export function delayUntil(
  condition: () => boolean,
  intervalTimeout: number,
  rejectTimeout: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      reject();
      clearInterval(intervalTimer);
      clearTimeout(timeoutTimer);
    }, rejectTimeout);

    const intervalTimer = setInterval(() => {
      if (condition()) {
        clearInterval(intervalTimer);
        clearTimeout(timeoutTimer);
        resolve();
      }
    }, intervalTimeout);
  });
}
