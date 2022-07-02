/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-19 11:06:08
 */
import vscode from "vscode";
import { evaluateTemplate, getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction, Template } from "../types";
import {
  CUSTOM_TEMPLATE_FILE_NAME,
  TEMPLATE_NAMED_GROUP_WILDCARD_PLACEHOLDER,
  TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER,
  WILDCARD_ACCESS_VARIABLES,
} from "../constants";
import { writeFile } from "fs/promises";
import path from "path";

export abstract class FileheaderLanguageProvider {
  public static async createCustomTemplate() {
    const customTemplateContent = (await import(
      "./provider.template"
    )) as unknown as string;

    const workspaces = vscode.workspace.workspaceFolders;
    if (!workspaces) {
      vscode.window.showErrorMessage(
        "Fileheader Pro: Your workspace is not contain any folder"
      );
      return;
    }

    const activeDocumentUri = vscode.window.activeTextEditor?.document.uri;
    let targetWorkspace: vscode.WorkspaceFolder | undefined = undefined;
    if (activeDocumentUri) {
      targetWorkspace = vscode.workspace.getWorkspaceFolder(activeDocumentUri);
    } else {
      const picked = await vscode.window.showQuickPick(
        workspaces.map((workspace) => ({ label: workspace.name, workspace })),
        { title: "Select which workspace for add custom fileheader template" }
      );

      targetWorkspace = picked?.workspace;
    }

    if (!targetWorkspace) {
      return;
    }

    const templatePath = path.join(
      targetWorkspace.uri.fsPath,
      ".vscode",
      CUSTOM_TEMPLATE_FILE_NAME
    );

    await writeFile(templatePath, customTemplateContent);

    const document = await vscode.workspace.openTextDocument(
      path.resolve(templatePath)
    );

    vscode.window.showTextDocument(document);
  }
  /**
   *
   * @param workspaceScopeUri the custom loader workspace folder uri
   */
  constructor(public readonly workspaceScopeUri?: vscode.Uri) {
    this.calculateVariableAccessInfo();
  }

  public get isCustomProvider() {
    return !!this.workspaceScopeUri;
  }

  abstract readonly languages: string[];

  readonly startLineOffset = 0;

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
      template.interpolations,
      true
    );
    const pattern = templateValue
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

      // user custom template may have `\r\n`, for example, read a file in Windows.
      // We should normalize it to `\n`
      .replace(/\r\n/g, "\n")
      .replace(
        new RegExp(`${TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER.start}`, "g"),
        "(?:"
      )
      .replace(
        new RegExp(`${TEMPLATE_OPTIONAL_GROUP_PLACEHOLDER.end}`, "g"),
        ")?"
      )
      .replace(
        new RegExp(
          `${TEMPLATE_NAMED_GROUP_WILDCARD_PLACEHOLDER}_(\\w+)_${TEMPLATE_NAMED_GROUP_WILDCARD_PLACEHOLDER}`,
          "g"
        ),
        "(?<$1>.*)"
      )
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

  public readonly accessVariableFields = new Set<keyof IFileheaderVariables>();
  private calculateVariableAccessInfo() {
    const addVariableAccess = (p: string) =>
      this.accessVariableFields.add(p as keyof IFileheaderVariables);

    const proxyVariables = new Proxy(WILDCARD_ACCESS_VARIABLES, {
      get(target, p, receiver) {
        addVariableAccess(p as string);
        return Reflect.get(target, p);
      },
    });

    this.getTemplateInternal(proxyVariables);
  }
}
