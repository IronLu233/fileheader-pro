/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-02 16:53:59
 */
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class HTMLFileheaderProvider extends FileheaderLanguageProvider {
  readonly languages: string[] = ["html", "xml"];

  blockCommentStart: string = "<!--";
  blockCommentEnd: string = "-->";

  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    const authorEmailPart =
      variables.authorEmail && `<${variables.authorEmail}>`;
    const authorLine =
      variables.authorName &&
      `\nauthor:        ${variables.authorName} ${authorEmailPart}`;
    const birthtimeLine =
      variables.birthtime && `\ndate:          ${variables.birthtime}`;
    const lastModifiedLine =
      variables.mtime && `\nlastModified  ${variables.mtime}`;
    const companyNameLine =
      variables.companyName &&
      `\nCopyright © ${variables.companyName} All rights reserved`;

    // prettier-ignore
    return tpl
`<!--${authorLine}${birthtimeLine}${lastModifiedLine}${companyNameLine}
-->`;

    // like this:
    /*
    <!-- 
    author:        ${variables.authorName} <${variables.authorEmail}>
    date:          ${variables.birthtime}
    lastModified:  ${variables.mtime}
    Copyright © ${variables.companyName} All rights reserved
    -->
    */
  }
}
