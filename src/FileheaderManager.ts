import vscode from "vscode";
import { memoize, last, head } from "lodash-es";
import { fileheaderProviderLoader } from "./FileheaderProviderLoader";
import { FileheaderLanguageProvider } from "./Providers";
import { hasShebang } from "./Utils";
import { extensionConfigManager } from "./ExtensionConfigManager";
import { FileheaderVariableBuilder } from "./FileheaderVariableBuilder";

class FileheaderManager {
  constructor() {
    this._findProvider = memoize(this._findProvider);
  }

  private _providers: FileheaderLanguageProvider[] = [];

  public async loadProviders() {
    this._providers = await fileheaderProviderLoader.loadProviders();
  }

  private _findProvider(languageId: string) {
    return this._providers.find((provider) =>
      provider.languages.some((l) => l === languageId)
    );
  }

  private getOriginFileheaderPositions(
    document: vscode.TextDocument,
    provider: FileheaderLanguageProvider
  ) {
    const strings = provider.getTemplateStrings();
    const source = document.getText();
    const positions = strings.map((str) => source.indexOf(str));
    return positions;
  }

  public async updateFileheader(document: vscode.TextDocument) {
    const provider = this._findProvider(document.languageId);

    const filePath = document.fileName;
    if (!provider) {
      vscode.window.showErrorMessage("This language is not supported.");
      return;
    }

    let startLine =
      provider.startLineOffset + (hasShebang(document.getText()) ? 1 : 0);

    const originPosition = this.getOriginFileheaderPositions(
      document,
      provider
    );
    const config = extensionConfigManager.get();
    const fileheaderVariable = await new FileheaderVariableBuilder().build(
      config,
      filePath
    );

    const editor = await vscode.window.showTextDocument(document);
    const fileheader = provider.getFileheader(fileheaderVariable);
    if (originPosition.length > 0) {
      const originStart = document.positionAt(head(originPosition)!);
      const originEnd = document.positionAt(last(originPosition)!);
      await editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(originStart, originEnd),
          fileheader
        );
      });
    } else {
      await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(startLine, 0), fileheader);
      });
    }
  }
}

/**
 * @singleton
 */
export const fileheaderManager = new FileheaderManager();
