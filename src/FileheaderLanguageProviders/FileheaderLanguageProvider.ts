import vscode from "vscode";
import { getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction } from "../types";

export abstract class FileheaderLanguageProvider {
  abstract languages: string[];

  startLineOffset = 0;

  abstract blockCommentStart: string;
  abstract blockCommentEnd: string;

  protected abstract getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ): [TemplateStringsArray, any[]];

  private getTemplateInternal(variables: IFileheaderVariables) {
    return this.getTemplate(getTaggedTemplateInputs, variables);
  }

  public getTemplateStrings(): string[] {
    return Array.from(this.getTemplateInternal({} as IFileheaderVariables)[0]);
  }

  public getFileheader(variables: IFileheaderVariables): string {
    const [_strings, interpolations] = this.getTemplateInternal(variables);
    const strings = Array.from(_strings);

    let fileheader = strings.shift()!;
    for (let index = 0; index < interpolations.length; index++) {
      fileheader += interpolations[index] + strings[index];
    }

    return fileheader;
  }

  public getOriginFileheaderRegExp(eol: vscode.EndOfLine): RegExp {
    let pattern = this.getTemplateStrings()
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("(.*)");

    if (eol === vscode.EndOfLine.CRLF) {
      pattern = pattern.replace(/\n/g, "\r\n");
    }

    return new RegExp(pattern, "m");
  }
}
