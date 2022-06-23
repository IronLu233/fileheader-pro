import vscode from "vscode";
import { memoize } from "lodash-es";
import { fileheaderProviderLoader } from "./FileheaderProviderLoader";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProviders";
import { hasShebang, offsetSelection } from "./Utils";
import { extensionConfigManager } from "./ExtensionConfigManager";
import { FileheaderVariableBuilder } from "./FileheaderVariableBuilder";
import { IFileheaderVariables } from "./types";
import { MissUserNameEmailError } from "./Error/MissUserNameEmailError";
import { NoVCSProviderError } from "./Error/NoVCSProviderError";

type UpdateFileheaderManagerOptions = {
  silentWhenUnsupported?: boolean;
  allowInsert?: boolean;
};

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

  private shouldSkipReplace() {
    // first, when we open a file, we should record the origin file hash
    // after close, the hash should be cleaned
    // if there is a change in VCS provider, we should replace the fileheader
    // if the file in vscode editor not dirty, we should skip the replace
    // if not, compare the file hash and if they are the same, we should skip
    // implement TBD
    return false;
  }

  public async updateFileheader(
    document: vscode.TextDocument,
    {
      allowInsert = true,
      silentWhenUnsupported = false,
    }: UpdateFileheaderManagerOptions = {}
  ) {
    const provider = this._findProvider(document.languageId);

    const filePath = document.fileName;
    if (!provider) {
      !silentWhenUnsupported &&
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

    let fileheaderVariable: IFileheaderVariables;

    try {
      fileheaderVariable = await new FileheaderVariableBuilder().build(
        config,
        filePath
      );
    } catch (error) {
      if (error instanceof MissUserNameEmailError) {
        vscode.window.showErrorMessage(error.message);
      }

      if (error instanceof NoVCSProviderError) {
        vscode.window.showErrorMessage(error.message);
      }
      return;
    }

    const editor = await vscode.window.showTextDocument(document);
    const fileheader = provider.getFileheader(fileheaderVariable);

    if (originFileheaderOffsetRange.start !== -1) {
      const originStart = document.positionAt(
        originFileheaderOffsetRange.start
      );
      const originEnd = document.positionAt(originFileheaderOffsetRange.end);
      await editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(originStart, originEnd),
          fileheader
        );
      });
    } else if (allowInsert) {
      const onlyHasSingleLine = document.lineCount === 1;
      const isLeadingLineEmpty = document.lineAt(startLine).isEmptyOrWhitespace;
      const shouldInsertLineBreak = !isLeadingLineEmpty || onlyHasSingleLine;
      const value = shouldInsertLineBreak ? fileheader + "\n" : fileheader;
      await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(startLine, 0), value);
      });
    } else {
      return;
    }
  }
}

/**
 * @singleton
 */
export const fileheaderManager = new FileheaderManager();
