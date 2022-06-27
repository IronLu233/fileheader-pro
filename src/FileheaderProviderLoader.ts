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
import { join, resolve } from "path";
import fs from "fs/promises";
import exists from "fs.promises.exists";
import vscode from "vscode";
import evalModule from "eval";
import {
  internalProviders,
  FileheaderLanguageProvider,
} from "./FileheaderLanguageProviders";
import { getStringHash } from "./Utils";
import { CUSTOM_TEMPLATE_FILE_NAME } from "./constants";

class FileheaderProviderLoader {
  public async loadProviders(): Promise<FileheaderLanguageProvider[]> {
    const customProviders = await this.loadCustomProvers();
    return [...customProviders, ...internalProviders];
  }

  private async loadCustomProvers(): Promise<FileheaderLanguageProvider[]> {
    const providers: FileheaderLanguageProvider[] = [];
    for (let folder of vscode.workspace.workspaceFolders || []) {
      const path = join(
        folder.uri.fsPath,
        ".vscode",
        CUSTOM_TEMPLATE_FILE_NAME
      );

      if (!(await exists(path))) {
        continue;
      }

      try {
        const content = await fs.readFile(path, "utf8");
        const templates = evalModule(
          content,
          path + getStringHash(content),
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            FileheaderLanguageProvider: FileheaderLanguageProvider,
            __dirname: resolve(folder.uri.fsPath, ".vscode"),
          },
          true
        ) as (new () => FileheaderLanguageProvider)[];

        // eslint-disable-next-line @typescript-eslint/naming-convention
        templates.forEach((TemplateConstructor) => {
          const instance = new TemplateConstructor();
          if (!(instance instanceof FileheaderLanguageProvider)) {
            return;
          }
          instance.workspaceScopeUri = folder.uri;
          providers.push(instance);
        });
      } catch (e) {
        console.error(e);

        vscode.window.showErrorMessage(
          `Your custom template file has runtime error.Reason:\n${
            (e as Error).message
          }`
        );

        // ignore error
      }
    }
    return providers;
  }
}

/**
 * @singleton
 */
export const fileheaderProviderLoader = new FileheaderProviderLoader();
