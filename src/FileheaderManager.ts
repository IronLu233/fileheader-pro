import vscode from "vscode";
import { memoize, last, head, replace } from "lodash-es";
import { fileheaderProviderLoader } from "./FileheaderProviderLoader";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProviders";
import { hasShebang, offsetSelection } from "./Utils";
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

  private getOriginFileheaderOffsetRange(
    document: vscode.TextDocument,
    provider: FileheaderLanguageProvider
  ) {
    const source = document.getText();
    const pattern = provider.getOriginFileheaderRegExp(document.eol);
    const range = {
      start: -1,
      end: -1,
    };
    const result = source.match(pattern);
    if (result) {
      const match = result[0];
      range.start = result.index!;

      range.end = range.start + match.length;
    }
    return range;
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

    const originFileheaderOffsetRange = this.getOriginFileheaderOffsetRange(
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

    const originSelection = editor.selection;
    if (originFileheaderOffsetRange.start !== -1) {
      const originStart = document.positionAt(
        originFileheaderOffsetRange.start
      );
      const originEnd = document.positionAt(
        originFileheaderOffsetRange.end + 1
      );
      await editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(originStart, originEnd),
          fileheader
        );
      });
    } else {
      const onlyHasSingleLine = document.lineCount === 1;
      const isLeadingLineEmpty = document.lineAt(startLine).isEmptyOrWhitespace;
      const shouldInsertLineBreak = !isLeadingLineEmpty || onlyHasSingleLine;
      const value = shouldInsertLineBreak ? fileheader + "\n" : fileheader;
      await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(startLine, 0), value);
      });
    }

    // move to origin position
    editor.selection = offsetSelection(
      originSelection,
      fileheader.split("\n").length
    );
  }
}

/**
 * @singleton
 */
export const fileheaderManager = new FileheaderManager();
