import { expect } from "chai";
import sinon from "sinon";
import path from "path";
import * as vscode from "vscode";
import rimraf from "rimraf";
import {
  createAndShowDocument,
  closeAllEditors,
  setDisableFields,
  copyCustomProvider,
} from "./utils";
import { internalProviders } from "../../FileheaderLanguageProviders";
import fs from "fs/promises";
import { WILDCARD_ACCESS_VARIABLES } from "../../constants";
import fsExists from "fs.promises.exists";

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

const languageIdFileExtensionMap: Record<string, string> = {
  python: "py",
  typescript: "ts",
  vue: "vue",
  html: "html",
  css: "css",
};

describe("Preset fileheader", () => {
  before(async () => {
    const exists = await fsExists(workspacePath + "/.vscode");
    if (!exists) {
      await fs.mkdir(workspacePath + "/.vscode");
    }
  });

  beforeEach(async () => {
    rimraf.sync(workspacePath + "/*");
    await closeAllEditors();
    showInformationMessageProxy.resetHistory();
    await setDisableFields(["mtime"]);
  });

  internalProviders.forEach((provider) => {
    const getFileName = (name: string) => {
      return `${name}.${languageIdFileExtensionMap[provider.languages[0]]}`;
    };

    describe(`[${provider.constructor.name}]`, () => {
      it("Should fileheader plugin works when execute command", async () => {
        const filePath = path.join(workspacePath, getFileName("shouldWork"));
        const document = await createAndShowDocument(filePath);
        const onSaveDocument = new Promise<vscode.TextDocument>((resolve) => {
          const disposer = vscode.workspace.onDidSaveTextDocument((e) => {
            resolve(e);
            disposer.dispose();
          });
        });
        await vscode.commands.executeCommand("fileheader-pro.fileheader");

        const savedDocument = await onSaveDocument;

        expect(document.getText()).to.equal(savedDocument.getText());

        expect(
          provider
            .getOriginFileheaderRegExp(savedDocument.eol)
            .test(savedDocument.getText())
        ).to.be.true;
      });

      it("Should not modify the origin fileheader when there is already have one and doesn't have any changes", async () => {
        const filePath = path.join(
          workspacePath,
          getFileName("shouldNotModify")
        );
        const document = await createAndShowDocument(filePath);
        await vscode.commands.executeCommand("fileheader-pro.fileheader");
        const content1 = document.getText();
        await vscode.commands.executeCommand("fileheader-pro.fileheader");

        const content2 = document.getText();
        expect(content1).eq(content2);
      });

      it("Should modify the origin fileheader when there already have one but file changes", async () => {
        const filePath = path.join(workspacePath, getFileName("shouldModify"));
        const document = await createAndShowDocument(filePath);
        await vscode.commands.executeCommand("fileheader-pro.fileheader");
        const content1 = document.getText();
        const editor = await vscode.window.showTextDocument(document);
        await editor.edit((editBuilder) => {
          editBuilder.insert(
            new vscode.Position(document.lineCount - 1, 0),
            `const 蹦蹦 = '蹦蹦'`
          );
        });

        await document.save();
        await vscode.commands.executeCommand("fileheader-pro.fileheader");
        const content2 = document.getText();
        expect(content1).to.not.equal(content2);
      });

      it("Should disabled fields works well", async () => {
        const filePath = path.join(workspacePath, getFileName("disableFields"));
        await setDisableFields(["mtime", "authorName", "authorEmail"]);
        const document = await createAndShowDocument(filePath);
        await vscode.commands.executeCommand("fileheader-pro.fileheader");

        expect(document.getText())
          .to.includes("date")
          .to.includes("Copyright © ")
          .to.not.includes("author")
          .to.not.includes("lastModified");
      });
    });
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
});

describe("Custom fileheader", () => {
  before(async () => {
    const exists = await fsExists(workspacePath + ".vscode");
    if (!exists) {
      try {
        await fs.mkdir(workspacePath + "/.vscode");
      } catch {}
    }
  });
  beforeEach(async () => {
    rimraf.sync(workspacePath + "/*");
    await setDisableFields([]);
    await closeAllEditors();
    showInformationMessageProxy.resetHistory();
  });

  it("Should custom provider works well", async () => {
    await setDisableFields([
      "birthtime",
      "mtime",
      "authorName",
      "authorEmail",
      "userName",
      "userEmail",
      "companyName",
      "projectName",
      "filePath",
      "dirPath",
      "fileName",
    ]);
    const filePath = path.join(workspacePath, "customProvider.ts");
    const customProviderPath = await copyCustomProvider(workspacePath);
    const templateDocument = await vscode.workspace.openTextDocument(
      customProviderPath
    );
    await templateDocument.save();

    const document = await createAndShowDocument(filePath);
    await vscode.commands.executeCommand(
      "fileheader-pro.reloadCustomTemplateProvider"
    );
    await vscode.commands.executeCommand("fileheader-pro.fileheader");
    const content = document.getText();
    for (const field of Reflect.ownKeys(
      WILDCARD_ACCESS_VARIABLES
    ) as string[]) {
      expect(content).to.includes(`${field}:`);
    }
  });
});
