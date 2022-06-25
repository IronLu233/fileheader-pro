import vscode from "vscode";
import { evaluateTemplate, getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction, Template } from "../types";
import {
  TEMPLATE_WILDCARD_PLACEHOLDER,
  WILDCARD_ACCESS_VARIABLES,
} from "../constants";
import { writeFile } from "fs/promises";
import customTemplateContent from "./provider.template";
import path from "path";

export abstract class FileheaderLanguageProvider {
  public static createCustomTemplate() {
    const workspaces = vscode.workspace.workspaceFolders;
    if (!workspaces) {
      vscode.window.showErrorMessage(
        "Your workspace is not contain any folder"
      );
      return;
    }

    const activeDocumentUri = vscode.window.activeTextEditor?.document.uri;
    let targetWorkspace: vscode.WorkspaceFolder | undefined = undefined;
    if (activeDocumentUri) {
      targetWorkspace = vscode.workspace.getWorkspaceFolder(activeDocumentUri);
    } else {
      vscode.window.showQuickPick(
        workspaces.map((workspace) => workspace.name),
        { title: "Select which workspace for add custom fileheader template" }
      );
    }

    if (!targetWorkspace) {
      return;
    }

    return writeFile(
      path.join(
        targetWorkspace.uri.fsPath,
        ".vscode",
        "fileheader.template.js"
      ),
      customTemplateContent
    );
  }

  abstract languages: string[];

  startLineOffset = 0;

  /**
   * internal field
   * only have when it is a custom FileheaderProvider
   */
  workspaceUri: vscode.Uri | undefined;

  abstract blockCommentStart: string;
  abstract blockCommentEnd: string;

  protected abstract getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ): Template;

  private getTemplateInternal(variables: IFileheaderVariables) {
    return this.getTemplate(getTaggedTemplateInputs, variables);
  }

  public getFileheader(variables: IFileheaderVariables): string {
    const { strings: _strings, interpolations } =
      this.getTemplateInternal(variables);
    const strings = Array.from(_strings);

    return evaluateTemplate(strings, interpolations);
  }

  public getOriginFileheaderRegExp(eol: vscode.EndOfLine): RegExp {
    const template = this.getTemplateInternal(
      WILDCARD_ACCESS_VARIABLES as IFileheaderVariables
    );

    const templateValue = evaluateTemplate(
      template.strings,
      template.interpolations
    );
    const pattern = templateValue
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(new RegExp(TEMPLATE_WILDCARD_PLACEHOLDER, "g"), ".*")
      .replace(/\n/g, eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n");

    return new RegExp(pattern, "m");
  }

  public getSourcefileWithoutFileheader(document: vscode.TextDocument): string {
    const regexp = new RegExp(
      this.getOriginFileheaderRegExp(document.eol),
      "mg"
    );
    const source = document.getText();
    return source.replace(regexp, "");
  }
}
