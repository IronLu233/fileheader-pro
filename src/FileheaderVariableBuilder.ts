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
import { basename, dirname } from "path";
import { relative } from "path/posix";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { VCSProvider } from "./VCSProvider";
import { stat } from "fs/promises";
import { ConfigSection } from "./constants";

/**
 * query template variable fields when it is enabled
 * @param disabled if true this function will return undefined immediately
 * @param queryAction get variable operation
 * @param fallbackVal fallback value, if it is falsy, it will throw the origin error
 * @returns variable value or fallback value
 */
async function queryFieldsExceptDisable<T>(
  disabled: boolean,
  queryAction: () => Promise<T> | T,
  fallbackVal?: T
): Promise<T | undefined> {
  if (disabled) {
    return undefined;
  }
  try {
    return await queryAction();
  } catch (e) {
    if (fallbackVal) {
      return fallbackVal;
    }
    throw e;
  }
}

export class FileheaderVariableBuilder {
  // TODO: slow code. need optimize performance
  public async build(
    config: vscode.WorkspaceConfiguration,
    fileUri: vscode.Uri,
    originVariable?: IFileheaderVariables
  ): Promise<IFileheaderVariables> {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    const disableFieldSet = new Set(
      config.get<(keyof IFileheaderVariables)[]>(
        ConfigSection.disableFields,
        []
      )
    );
    const dateFormat = config.get(
      ConfigSection.dateFormat,
      "YYYY-MM-DD HH:mm:ss"
    );

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
    const currentTime = dayjs();
    if (!fixedUserEmail || !fixedUserName) {
      await VCSProvider.validate(dirname(fsPath));
    }

    const companyName = await queryFieldsExceptDisable(
      disableFieldSet.has("companyName"),
      () => {
        return config.get<string>(ConfigSection.companyName)!;
      }
    );

    const fileStat = await stat(fsPath);
    const isTracked = await VCSProvider.isTracked(fsPath);

    const userName = await queryFieldsExceptDisable(
      disableFieldSet.has("userName"),
      () => VCSProvider.getUserName(dirname(fsPath)),
      fixedUserName!
    );

    const userEmail = await queryFieldsExceptDisable(
      disableFieldSet.has("userEmail"),
      () => VCSProvider.getUserEmail(dirname(fsPath)),
      fixedUserEmail!
    );

    const authorName = await queryFieldsExceptDisable(
      disableFieldSet.has("authorName"),
      () => {
        return isTracked ? VCSProvider.getAuthorName(fsPath) : userName;
      },
      userName
    );

    const authorEmail = await queryFieldsExceptDisable(
      disableFieldSet.has("authorEmail"),
      () => {
        return isTracked ? VCSProvider.getAuthorEmail(fsPath) : userEmail;
      },
      userEmail
    );

    let birthtime = await queryFieldsExceptDisable(
      disableFieldSet.has("birthtime"),
      () => {
        return isTracked
          ? VCSProvider.getBirthtime(fsPath)
          : dayjs(fileStat.birthtime);
      },
      dayjs(fileStat.birthtime)
    );

    const originBirthtime = dayjs(originVariable?.birthtime, dateFormat);

    if (originBirthtime.isBefore(birthtime)) {
      birthtime = originBirthtime;
    }

    const mtime = await queryFieldsExceptDisable(
      disableFieldSet.has("mtime"),
      () => currentTime
    );

    let projectName: string | undefined = undefined;
    let filePath: string | undefined = undefined;
    let dirPath: string | undefined = undefined;
    let fileName = basename(fileUri.path);
    if (workspace) {
      projectName = await queryFieldsExceptDisable(
        disableFieldSet.has("projectName"),
        () => basename(workspace.uri.path)
      );
      filePath = await queryFieldsExceptDisable(
        disableFieldSet.has("filePath"),
        () => relative(workspace.uri.path, fileUri.path)
      );
      dirPath = await queryFieldsExceptDisable(
        disableFieldSet.has("dirPath"),
        () => relative(workspace.uri.path, dirname(fileUri.path))
      );
    }

    return {
      birthtime: birthtime?.format(dateFormat),
      mtime: mtime?.format(dateFormat),
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
