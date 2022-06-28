/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-12 22:33:53
 */
import vscode from "vscode";
import { ChildProcess, exec as _exec, ExecOptions } from "child_process";
import { CommandExecError } from "./Error/CommandExecError";
import { Template, TemplateInterpolation } from "./types";
import { TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER, TEMPLATE_SYMBOL_KEY } from "./constants";
import crypto from "crypto";
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

export function offsetSelection(selection: vscode.Selection, offsetLine: number) {
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
  interpolations: TemplateInterpolation[],
  addOptionalRegexpMark = false
) {
  const [first, ...restStrings] = strings;
  const addMarks = (str: TemplateInterpolation) =>
    addOptionalRegexpMark
      ? `${TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER.start}${str}${TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER.end}`
      : str;
  let result = first;

  for (let index = 0; index < interpolations.length; index++) {
    const interpolation = interpolations[index];
    if (interpolation && typeof interpolation === "object" && interpolation[TEMPLATE_SYMBOL_KEY]) {
      result +=
        addMarks(
          evaluateTemplate(
            interpolation.strings,
            interpolation.interpolations,
            addOptionalRegexpMark
          )
        ) || "";
      result += restStrings[index];
    } else {
      result += addMarks(interpolation || "") + restStrings[index];
    }
  }

  return result;
}

/**
 * get string hash of the given string
 * @param input the input string
 */
export function getStringHash(input: string) {
  return crypto.createHash("sha1").update(input).digest("base64");
}
