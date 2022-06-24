import * as vscode from "vscode";
import { fileheaderManager } from "./FileheaderManager";

class Extension {
  private disposers: vscode.Disposable[] = [];

  activate = async (context: vscode.ExtensionContext) => {
    await fileheaderManager.loadProviders();
    this.disposers.push(
      vscode.commands.registerCommand(
        "fileheader-pro.fileheader",
        this.executeCommand,
        this
      )
    );

    this.disposers.push(
      vscode.workspace.onDidCreateFiles(this.onCreateDocument, this)
    );

    this.disposers.push(
      vscode.workspace.onWillSaveTextDocument(this.onSaveDocument, this)
    );

    this.disposers.push(
      vscode.window.onDidChangeVisibleTextEditors(
        this.onDidChangeVisibleTextEditors
      )
    );
  };

  deactivate = () => {
    for (let disposer of this.disposers) {
      disposer.dispose();
    }
  };

  private async executeCommand(...args: any[]) {
    const currentDocument = vscode.window.activeTextEditor?.document;
    if (!currentDocument) {
      await vscode.window.showErrorMessage("You should open a file first.");
      return;
    }
    fileheaderManager.updateFileheader(currentDocument);
  }

  private async onCreateDocument(e: vscode.FileCreateEvent) {
    for (let file of e.files) {
      const document = await vscode.workspace.openTextDocument(file);
      await fileheaderManager.updateFileheader(document, {
        silentWhenUnsupported: true,
      });
    }
  }

  private onSaveDocument(e: vscode.TextDocumentWillSaveEvent) {
    // disable insert new fileheader because it will cause some issues
    // we only support update origin fileheader
    const updatePromise = fileheaderManager.updateFileheader(e.document, {
      allowInsert: false,
    });
    e.waitUntil(updatePromise);
  }

  private onDidChangeVisibleTextEditors(e: readonly vscode.TextEditor[]) {
    fileheaderManager.recordOriginFileHash(e.map((it) => it.document));
  }
}

/**
 * @singleton
 */
const extension = new Extension();

export const activate = extension.activate;
export const deactivate = extension.deactivate;
