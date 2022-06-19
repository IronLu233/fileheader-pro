import vscode from "vscode";
import { dirname } from "path";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { VCSProvider } from "./VCSProvider";
import { stat } from "fs/promises";

/**
 *  get variable from VCS or fallback when it is not available
 * @param operation get variable operation
 * @param fallback fallback value
 * @returns variable value or fallback value
 */
async function fallbackVariable<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export class FileheaderVariableBuilder {
  public async build(
    config: vscode.WorkspaceConfiguration,
    filePath: string
  ): Promise<IFileheaderVariables> {
    const currentTime = dayjs();
    const fileStat = await stat(filePath);

    const userName = await VCSProvider.getUserName(dirname(filePath));
    const userEmail = await VCSProvider.getUserEmail(dirname(filePath));

    const authorName = await fallbackVariable(
      () => VCSProvider.getAuthorName(filePath),
      userName
    );
    const authorEmail = await fallbackVariable(
      () => VCSProvider.getAuthorEmail(filePath),
      userEmail
    );
    const ctime = await fallbackVariable(
      () => VCSProvider.getCtime(filePath),
      dayjs(fileStat.ctime)
    );

    const companyName = config.get<string>("companyName");
    const dateFormat = config.get("dateFormat", "YYYY-MM-DD HH:mm:ss");

    return {
      ctime: ctime.format(dateFormat),
      mtime: currentTime.format(dateFormat),
      authorName,
      authorEmail,
      userName,
      userEmail,
      companyName,
    };
  }
}
