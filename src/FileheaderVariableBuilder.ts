import vscode from "vscode";
import { stat } from "fs/promises";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { exec } from "./Utils";

export class FileheaderVariableBuilder {
  public async build(
    config: vscode.WorkspaceConfiguration,
    filePath: string
  ): Promise<IFileheaderVariables> {
    const stats = await stat(filePath);
    const getAuthorCommand = config.get("getAuthorCommand") as string;
    const getCurrentUserCommand = config.get("getCurrentUserCommand") as string;
    const companyName = config.get("companyName");

    const [author, userName] = await Promise.all([
      exec(getAuthorCommand),
      exec(getCurrentUserCommand),
    ]);

    return {
      ctime: dayjs(stats.ctime),
      mtime: dayjs(),
      author: author,
    };
  }
}
