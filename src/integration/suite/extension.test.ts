import { expect } from "chai";
import sinon from "sinon";
import path from "path";
import * as vscode from "vscode";
import rimraf from "rimraf";
import { createAndShowDocument, closeAllEditors } from "./utils";
import { TypescriptFileheaderProvider } from "../../FileheaderLanguageProviders/TypescriptFileheaderProvider";

const showInformationMessageProxy = sinon
  .stub<any, any>(vscode.window, "showInformationMessage")
  .callsFake(((...args: any[]) => {
    (showInformationMessageProxy.wrappedMethod as any)(...args);
    return Promise.resolve();
  }) as any);

const showErrorMessageProxy = sinon
  .stub<any, any>(vscode.window, "showErrorMessage")
  .callsFake(((...args: any[]) => {
    (showErrorMessageProxy.wrappedMethod as any)(...args);
  }) as any);

const workspacePath = process.env.TEST_WORKSPACE_DIR!;

describe("Preset fileheader", () => {
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
    expect(
      showErrorMessageProxy.calledOnceWith(
        "Fileheader Pro: You should open a file first."
      )
    ).true;
  });

  it("Should show error when the document language id is not supported", async () => {
    const filePath = path.join(workspacePath, "shouldNotWork.json");
    const document = await createAndShowDocument(filePath);

    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    expect(document.getText()).to.be.empty;
    expect(showErrorMessageProxy.calledOnce).to.be.true;
    expect(
      showErrorMessageProxy.calledOnceWith(
        "Fileheader Pro: This language is not supported."
      )
    );
  });

  it("Should not modify the origin fileheader when there is already have one and doesn't have any changes", async () => {
    const filePath = path.join(workspacePath, "shouldNotModify.ts");
    const document = await createAndShowDocument(filePath);
    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    const content1 = document.getText();
    await vscode.commands.executeCommand("fileheader-pro.fileheader");

    const content2 = document.getText();
    expect(content1).eq(content2);
  });

  it("Should modify the origin fileheader when there already have one but file changes", async () => {
    const filePath = path.join(workspacePath, "shouldModify.ts");
    const document = await createAndShowDocument(filePath);
    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    const content1 = document.getText();
    const editor = await vscode.window.showTextDocument(document);
    await editor.edit((editBuilder) => {
      editBuilder.insert(
        new vscode.Position(document.lineCount - 1, 0),
        `'const 蹦蹦 = '蹦蹦'`
      );
    });

    await document.save();
    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    const content2 = document.getText();
    expect(content1).to.not.equal(content2);
  });
});
