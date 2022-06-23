import vscode from "vscode";
import { dirname } from "path";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { VCSProvider } from "./VCSProvider";
import { stat } from "fs/promises";
import { ExtensionConfigSectionKey } from "./constants";

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
    filePath: string
  ): Promise<IFileheaderVariables> {
    const fixedUserName = config.get<string | null>(
      ExtensionConfigSectionKey.userName,
      null
    );
    const fixedUserEmail = config.get<string | null>(
      ExtensionConfigSectionKey.userEmail,
      null
    );

    const disableMtime = config.get<boolean>(ExtensionConfigSectionKey.disableModifiedTime, true);

    if (!fixedUserEmail || !fixedUserName) {
      await VCSProvider.validate(dirname(filePath));
    }

    const currentTime = dayjs();
    const fileStat = await stat(filePath);

    const isTracked = await VCSProvider.isTracked(filePath);

    const userName = await fallbackVariable(
      () => VCSProvider.getUserName(dirname(filePath)),
      fixedUserName!
    );
    const userEmail = await fallbackVariable(
      () => VCSProvider.getUserEmail(dirname(filePath)),
      fixedUserEmail!
    );

    const authorName = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getAuthorName(filePath),
          userName
        )
      : userName;

    const authorEmail = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getAuthorEmail(filePath),
          userEmail
        )
      : userEmail;

    const birthtime = isTracked
      ? await fallbackVariable(
          () => VCSProvider.getBirthtime(filePath),
          dayjs(fileStat.birthtime)
        )
      : dayjs(fileStat.birthtime);

    const companyName = config.get<string>("companyName");
    const dateFormat = config.get("dateFormat", "YYYY-MM-DD HH:mm:ss");


    const mtime = currentTime;

    return {
      birthTime: birthtime.format(dateFormat),

      // mtime may take some bugs
      mtime: disableMtime ? undefined : mtime.format(dateFormat),
      authorName,
      authorEmail,
      userName,
      userEmail,
      companyName,
    };
  }
}
