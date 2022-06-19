import { ExecException } from "child_process";

export class CommandExecError extends Error {
  constructor(
    public stderr: string,
    public stdout: string,
    public err: ExecException | null
  ) {
    super(`CommandExecError: ${stderr}`);
  }
}
