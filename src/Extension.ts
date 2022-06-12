import * as vscode from "vscode";
import { fileheaderManager } from "./FileheaderManager";

class Extension {
  private _disposers: vscode.Disposable[] = [];

  activate = async (context: vscode.ExtensionContext) => {
    await fileheaderManager.loadProviders();
    this._disposers.push(
      vscode.commands.registerCommand(
        "neo-fileheader.fileheader",
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

  private _onCreateDocument() {
    //
  }

  private _onSaveDocument() {
    //
  }
}

/**
 * @singleton
 */
const extension = new Extension();

export const activate = extension.activate;
export const deactivate = extension.deactivate;
