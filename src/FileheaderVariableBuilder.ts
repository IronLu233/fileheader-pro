import vscode from "vscode";
import { basename, dirname } from "path";
import { relative } from "path/posix";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { VCSProvider } from "./VCSProvider";
import { stat } from "fs/promises";
import { ConfigSection } from "./constants";

/**
 *  get variable from VCS or fallback when it is not available
 * @param operation get variable operation
 * @param fallback fallback value, if it is falsy, it will throw the origin error
 * @returns variable value or fallback value
 */
async function fallbackVariable<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await operation();
  } catch (e) {
    if (fallback) {
      return fallback;
    }
    throw e;
  }
}

export class FileheaderVariableBuilder {
  public async build(
    config: vscode.WorkspaceConfiguration,
    fileUri: vscode.Uri
  ): Promise<IFileheaderVariables> {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    workspace?.uri.path;
    const fsPath = fileUri.fsPath;

    const fixedUserName = config.get<string | null>(
      ConfigSection.userName,
      null
    );
    const fixedUserEmail = config.get<string | null>(
      ConfigSection.userEmail,
      null
    );

    if (!fixedUserEmail || !fixedUserName) {
      await VCSProvider.validate(dirname(fsPath));
    }

    const currentTime = dayjs();
    const fileStat = await stat(fsPath);

    const isTracked = await VCSProvider.isTracked(fsPath);

    const userName = await fallbackVariable(
      () => VCSProvider.getUserName(dirname(fsPath)),
      fixedUserName!
    );
    const userEmail = await fallbackVariable(
      () => VCSProvider.getUserEmail(dirname(fsPath)),
      fixedUserEmail!
    );

    const authorName = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getAuthorName(fsPath),
          userName
        )
      : userName;

    const authorEmail = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getAuthorEmail(fsPath),
          userEmail
        )
      : userEmail;

    const birthtime = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getBirthtime(fsPath),
          dayjs(fileStat.birthtime)
        )
      : dayjs(fileStat.birthtime);

    const companyName = config.get<string>(ConfigSection.companyName)!;
    const dateFormat = config.get(
      ConfigSection.dateFormat,
      "YYYY-MM-DD HH:mm:ss"
    );

    const mtime = currentTime;

    let projectName: string | undefined = undefined;
    let filePath: string | undefined = undefined;
    let dirPath: string | undefined = undefined;
    let fileName = basename(fileUri.path);
    if (workspace) {
      projectName = basename(workspace.uri.path);
      filePath = relative(workspace.uri.path, fileUri.path);
      dirPath = relative(workspace.uri.path, dirname(fileUri.path));
    }

    return {
      birthtime: birthtime.format(dateFormat),
      mtime: mtime.format(dateFormat),
      authorName,
      authorEmail,
      userName,
      userEmail,
      companyName,

      projectName,
      filePath,
      dirPath,
      fileName,
    };
  }
}
