import vscode from "vscode";
import { fileheaderProviderLoader } from "./FileheaderProviderLoader";
import { FileheaderLanguageProvider } from "./Providers";
import { hasShebang } from "./Utils";

class FileheaderManager {
  private _providers: FileheaderLanguageProvider[] = [];

  public async loadProviders() {
    this._providers = await fileheaderProviderLoader.loadProviders();
  }

  private _isSupportedLanguage(language: string) {
    return this._providers.some((provider) =>
      provider.languages.some((l) => l === language)
    );
  }

  private _hasExistingFileheader() {
    // not implement
    return false;
  }

  public updateFileheader(document: vscode.TextDocument) {
    if (hasShebang(document.getText())) {
      // move cursor to line 2
    }
    if (!this._isSupportedLanguage(document.languageId)) {
      return;
    }

    if (this._hasExistingFileheader()) {
      // remove old fileheader
    }
    // write new fileheader
  }
}

/**
 * @singleton
 */
export const fileheaderManager = new FileheaderManager();
