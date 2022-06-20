import * as vscode from "vscode";
import { fileheaderManager } from "./FileheaderManager";

class Extension {
  private _disposers: vscode.Disposable[] = [];

  activate = async (context: vscode.ExtensionContext) => {
    await fileheaderManager.loadProviders();
    this._disposers.push(
      vscode.commands.registerCommand(
        "fileheader-pro.fileheader",
        this._executeCommand,
        this
      )
    );

    this._disposers.push(
      vscode.workspace.onDidCreateFiles(this._onCreateDocument, this)
    );

    this._disposers.push(
      vscode.workspace.onWillSaveTextDocument(this._onSaveDocument, this)
    );
  };

  deactivate = () => {
    for (let disposer of this._disposers) {
      disposer.dispose();
    }
  };

  private async _executeCommand(...args: any[]) {
    const currentDocument = vscode.window.activeTextEditor?.document;
    if (!currentDocument) {
      await vscode.window.showErrorMessage("You should open a file first.");
      return;
    }
    fileheaderManager.updateFileheader(currentDocument);
  }

  private async _onCreateDocument(e: vscode.FileCreateEvent) {
    // wait vscode open new text document
    await new Promise<void>((resolve) => {
      const disposer = vscode.workspace.onDidOpenTextDocument(() => {
        disposer.dispose();
        resolve();
      });
    });

    const documentUriMap = new Map(
      vscode.workspace.textDocuments.map((d) => [d.uri.fsPath, d])
    );
    for (let file of e.files) {
      const document = documentUriMap.get(file.fsPath);

      document &&
        (await fileheaderManager.updateFileheader(document, {
          silentWhenUnsupported: true,
        }));
    }
  }

  private _onSaveDocument(e: vscode.TextDocumentWillSaveEvent) {
    // disable insert new fileheader because it will cause some issues
    // we only support update origin fileheader
    fileheaderManager.updateFileheader(e.document, { allowInsert: false });
  }
}

/**
 * @singleton
 */
const extension = new Extension();

export const activate = extension.activate;
export const deactivate = extension.deactivate;
