import { exec as _exec } from "child_process";
export function hasShebang(text: string): boolean {
  return text.startsWith("#!");
}

export function getTaggedTemplateInputs(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): [TemplateStringsArray, any[]] {
  return [strings, interpolations];
}

export function exec(command: string) {
  return new Promise<string>((resolve, reject) => {
    _exec(command, (error, stdout, stderr) => {
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
