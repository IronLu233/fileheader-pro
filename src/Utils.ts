import vscode from "vscode";
import { ChildProcess, exec as _exec, ExecOptions } from "child_process";
import { CommandExecError } from "./Error/CommandExecError";
import { Template, TemplateInterpolation } from "./types";
import { TEMPLATE_SYMBOL_KEY } from "./constants";

/**
 * whether text starts with `'#!'`
 */
export function hasShebang(text: string): boolean {
  return text.startsWith("#!");
}

export function getTaggedTemplateInputs(
  strings: TemplateStringsArray,
  ...interpolations: TemplateInterpolation[]
): Template {
  return {
    [TEMPLATE_SYMBOL_KEY]: true,
    strings,
    interpolations,
  };
}

/**
 * Promisify node exec function
 */
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

/**
 * recursive evaluate the given template and interpolations
 * falsy value will be empty string
 */
export function evaluateTemplate(
  strings: ReadonlyArray<string>,
  interpolations: TemplateInterpolation[]
) {
  const [first, ...restStrings] = strings;
  let result = first;

  for (let index = 0; index < interpolations.length; index++) {
    const interpolation = interpolations[index];
    if (
      interpolation &&
      typeof interpolation === "object" &&
      interpolation[TEMPLATE_SYMBOL_KEY]
    ) {
      result += evaluateTemplate(
        interpolation.strings,
        interpolation.interpolations
      );
      result += restStrings[index];
    } else {
      result += (interpolation ?? "") + restStrings[index];
    }
  }

  return result;
}
