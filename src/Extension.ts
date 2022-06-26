import * as vscode from "vscode";
import { ConfigSection } from "./constants";
import { extensionConfigManager } from "./ExtensionConfigManager";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProviders";
import { fileheaderManager } from "./FileheaderManager";

class Extension {
  private disposers: vscode.Disposable[] = [];
  private customTemplateFileheaderWatcher: vscode.FileSystemWatcher | undefined;

  activate = async (context: vscode.ExtensionContext) => {
    await fileheaderManager.loadProviders();
    this.disposers.push(
      vscode.commands.registerCommand(
        "fileheader-pro.fileheader",
        this.addFileheader,
        this
      )
    );

    this.disposers.push(
      vscode.commands.registerCommand(
        "fileheader-pro.generateCustomTemplate",
        this.createCustomTemplate,
        this
      )
    );

    this.createCustomTemplateFileListener();

    this.disposers.push(
      vscode.workspace.onDidChangeWorkspaceFolders(
        this.createCustomTemplateFileListener
      )
    );

    this.disposers.push(
      vscode.workspace.onDidCreateFiles(this.onCreateDocument, this)
    );

    this.disposers.push(
      vscode.workspace.onWillSaveTextDocument(this.onSaveDocument, this)
    );

    this.onDidChangeVisibleTextEditors(vscode.window.visibleTextEditors);
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

  private async addFileheader(...args: any[]) {
    const currentDocument = vscode.window.activeTextEditor?.document;
    if (!currentDocument) {
      await vscode.window.showErrorMessage("You should open a file first.");
      return;
    }
    fileheaderManager.updateFileheader(currentDocument);
  }

  createCustomTemplate() {
    return FileheaderLanguageProvider.createCustomTemplate();
  }

  private async onCreateDocument(e: vscode.FileCreateEvent) {
    const enabled = extensionConfigManager.get<boolean>(
      ConfigSection.autoInsertOnCreateFile
    );
    if (!enabled) {
      return;
    }

    for (let file of e.files) {
      const document = await vscode.workspace.openTextDocument(file);
      await fileheaderManager.updateFileheader(document, {
        silentWhenUnsupported: true,
      });
    }
  }

  private onSaveDocument(e: vscode.TextDocumentWillSaveEvent) {
    const enabled = extensionConfigManager.get<boolean>(
      ConfigSection.autoUpdateOnSave
    );
    if (!enabled) {
      return;
    }
    // disable insert new fileheader because it will cause some issues
    // we only support update origin fileheader
    const updatePromise = fileheaderManager.updateFileheader(e.document, {
      allowInsert: false,
      silentWhenUnsupported: true,
    });
    e.waitUntil(updatePromise);
  }

  private onDidChangeVisibleTextEditors(e: readonly vscode.TextEditor[]) {
    fileheaderManager.recordOriginFileHash(e.map((it) => it.document));
  }

  private async createCustomTemplateFileListener() {
    this.customTemplateFileheaderWatcher?.dispose();
    this.customTemplateFileheaderWatcher =
      vscode.workspace.createFileSystemWatcher(
        "**/.vscode/fileheader.template.js"
      );

    const reloadProviders = () => {
      fileheaderManager.loadProviders();
    };

    this.customTemplateFileheaderWatcher.onDidCreate(reloadProviders),
      this.customTemplateFileheaderWatcher.onDidChange(reloadProviders),
      this.customTemplateFileheaderWatcher.onDidDelete(reloadProviders);
  }
}

/**
 * @singleton
 */
const extension = new Extension();

export const activate = extension.activate;
export const deactivate = extension.deactivate;
