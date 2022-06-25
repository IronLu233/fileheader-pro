import { resolve } from "path";
import fs from "fs/promises";
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
      try {
        const path = resolve(
          folder.uri.fsPath,
          ".vscode",
          CUSTOM_TEMPLATE_FILE_NAME
        );

        const content = await fs.readFile(path, "utf8");
        const templates = evalModule(content, path + getStringHash(content), {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          FileheaderLanguageProvider: FileheaderLanguageProvider,
        }) as (new () => FileheaderLanguageProvider)[];

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
