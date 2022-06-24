import vscode from "vscode";
import { evaluateTemplate, getTaggedTemplateInputs } from "../Utils";
import { IFileheaderVariables, ITemplateFunction, Template } from "../types";
import {
  TEMPLATE_SYMBOL_KEY,
  TEMPLATE_WILDCARD_PLACEHOLDER,
  WILDCARD_ACCESS_VARIABLES,
} from "../constants";

export abstract class FileheaderLanguageProvider {
  abstract languages: string[];

  startLineOffset = 0;

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
