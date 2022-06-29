import { expect } from "chai";
import sinon from "sinon";
import fs from "fs/promises";
import path from "path";
import * as vscode from "vscode";
import rimraf from "rimraf";
import { TypescriptFileheaderProvider } from "../../FileheaderLanguageProviders/TypescriptFileheaderProvider";

const showInformationMessageProxy = sinon.spy(
  vscode.window,
  "showInformationMessage"
);

const showErrorMessageProxy = sinon.spy(vscode.window, "showErrorMessage");

const workspacePath = process.env.TEST_WORKSPACE_DIR!;

async function closeAllEditors() {
  for (let _ of vscode.workspace.textDocuments) {
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  }
}

async function createAndShowDocument(filePath: string, content = "") {
  await fs.writeFile(filePath, content);
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
  return document;
}

describe("Preset fileheader", () => {
  before(() => {});

  beforeEach(() => {
    rimraf.sync(workspacePath + "/**/*");
    showInformationMessageProxy.resetHistory();
  });

  it("Should fileheader plugin works when execute command", async () => {
    const filePath = path.join(workspacePath, "shouldWork.ts");
    const document = await createAndShowDocument(filePath);
    const onSaveDocument = new Promise<vscode.TextDocument>((resolve) => {
      const disposer = vscode.workspace.onDidSaveTextDocument((e) => {
        resolve(e);
        disposer.dispose();
      });
    });
    await vscode.commands.executeCommand("fileheader-pro.fileheader");

    const savedDocument = await onSaveDocument;

    expect(document).to.equal(savedDocument);

    const provider = new TypescriptFileheaderProvider();
    expect(
      provider
        .getOriginFileheaderRegExp(savedDocument.eol)
        .test(savedDocument.getText())
    ).to.be.true;
  });

  it("Should show an error toast when user don't have any active editor", async () => {
    await closeAllEditors();
    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    expect(showErrorMessageProxy.calledOnce).to.be.true;
    // TODO: assert error message content
  });

  it("Should show error when the document language id is not supported", async () => {
    const filePath = path.join(workspacePath, "shouldNotWork.json");
    const document = await createAndShowDocument(filePath);

    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    expect(document.getText()).to.be.empty;
    expect(showErrorMessageProxy.calledOnce).to.be.true;
    // TODO: assert error message content
  });
});
