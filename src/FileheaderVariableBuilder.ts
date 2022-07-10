/**
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
import path, { basename, dirname } from "path";
import { relative } from "path";
import dayjs from "dayjs";
import { IFileheaderVariables } from "./types";
import { VCSProvider } from "./VCSProvider";
import { stat } from "fs/promises";
import { ConfigSection, TEMPLATE_VARIABLE_KEYS } from "./constants";
import { difference } from "lodash-es";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProviders";
import upath from "upath";
// import { sha1 } from "object-hash";
// import { memoize } from "lodash-es";

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
  constructor() {
    // // memoize the function
    // // get VCS is takes cost a lot
    // this.build = memoize(
    //   this.build,
    //   (
    //     config: vscode.WorkspaceConfiguration,
    //     fileUri: vscode.Uri,
    //     originVariable?: IFileheaderVariables,
    //     isCustomProvider?: boolean
    //   ) => {
    //     return sha1({
    //       disableFields: config.get(ConfigSection.disableFields),
    //       dateFormat: config.get(ConfigSection.dateFormat),
    //       userName: config.get(ConfigSection.userName),
    //       userEmail: config.get(ConfigSection.userEmail),
    //       fileUri: fileUri.toJSON(),
    //       originVariable,
    //       isCustomProvider,
    //     });
    //   }
    // );
  }

  // TODO: slow code. need optimize performance
  public async build(
    config: vscode.WorkspaceConfiguration,
    fileUri: vscode.Uri,
    provider: FileheaderLanguageProvider,
    originVariable?: IFileheaderVariables
  ): Promise<IFileheaderVariables> {
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);

    const { isCustomProvider, accessVariableFields } = provider;
    // disable fields should not works on custom provider.
    // because it is meaningless

    const disableFieldSet = new Set(
      !isCustomProvider
        ? difference(
            config.get<(keyof IFileheaderVariables)[]>(
              ConfigSection.disableFields,
              []
            )
          )
        : difference(TEMPLATE_VARIABLE_KEYS, Array.from(accessVariableFields))
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

    const deferredCompanyName = queryFieldsExceptDisable(
      disableFieldSet.has("companyName"),
      () => {
        return config.get<string>(ConfigSection.companyName)!;
      }
    );

    const fileStat = await stat(fsPath);
    const isTracked = await VCSProvider.isTracked(fsPath);

    // authorName and authorEmail depends on username and userEmail in VCS
    const deferredUserName = queryFieldsExceptDisable(
      disableFieldSet.has("userName") && disableFieldSet.has("authorName"),
      () => VCSProvider.getUserName(dirname(fsPath)),
      fixedUserName!
    );

    const deferredUserEmail = queryFieldsExceptDisable(
      disableFieldSet.has("userEmail") && disableFieldSet.has("authorEmail"),
      () => VCSProvider.getUserEmail(dirname(fsPath)),
      fixedUserEmail!
    );

    let deferredBirthtime = queryFieldsExceptDisable(
      disableFieldSet.has("birthtime"),
      () => {
        return isTracked
          ? VCSProvider.getBirthtime(fsPath)
          : dayjs(fileStat.birthtime);
      },
      dayjs(fileStat.birthtime)
    );
    const deferredMtime = queryFieldsExceptDisable(
      disableFieldSet.has("mtime"),
      () => currentTime
    );

    const [companyName, userName, userEmail, _birthtime, mtime] =
      await Promise.all([
        deferredCompanyName,
        deferredUserName,
        deferredUserEmail,
        deferredBirthtime,
        deferredMtime,
      ] as const);

    const deferredAuthorName = queryFieldsExceptDisable(
      disableFieldSet.has("authorName"),
      () => {
        return isTracked ? VCSProvider.getAuthorName(fsPath) : userName;
      },
      userName
    );

    const deferredAuthorEmail = queryFieldsExceptDisable(
      disableFieldSet.has("authorEmail"),
      () => {
        return isTracked ? VCSProvider.getAuthorEmail(fsPath) : userEmail;
      },
      userEmail
    );

    const [authorName, authorEmail] = await Promise.all([
      deferredAuthorName,
      deferredAuthorEmail,
    ] as const);

    let birthtime = _birthtime;

    const originBirthtime = dayjs(originVariable?.birthtime, dateFormat);

    if (originBirthtime.isBefore(birthtime)) {
      birthtime = originBirthtime;
    }

    let projectName: string | undefined = undefined;
    let filePath: string | undefined = undefined;
    let dirPath: string | undefined = undefined;
    let fileName = basename(fileUri.path);

    if (workspace) {
      [projectName, filePath, dirPath] = await Promise.all([
        queryFieldsExceptDisable(disableFieldSet.has("projectName"), () =>
          upath.normalize(basename(workspace.uri.path))
        ),
        queryFieldsExceptDisable(disableFieldSet.has("filePath"), () =>
          upath.normalize(relative(workspace.uri.path, fileUri.path))
        ),
        await queryFieldsExceptDisable(
          disableFieldSet.has("dirPath"),
          () =>
            upath.normalize(
              relative(workspace.uri.path, dirname(fileUri.path))
            ) || ""
        ),
      ] as const);
    }

    return {
      birthtime: birthtime?.format(dateFormat),
      mtime: mtime?.format(dateFormat),
      authorName,
      authorEmail,
      userName: !disableFieldSet.has("userName") ? userName : undefined,
      userEmail: !disableFieldSet.has("userEmail") ? userEmail : undefined,
      companyName,

      projectName,
      filePath,
      dirPath,
      fileName,
    };
  }
}
