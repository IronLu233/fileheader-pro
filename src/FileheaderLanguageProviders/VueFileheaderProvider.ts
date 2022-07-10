/**
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-07-02 16:34:34
 */
import upath from "upath";
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class VueFileheaderProvider extends FileheaderLanguageProvider {
  readonly languages: string[] = ["vue"];

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

    const componentLine =
      variables.fileName &&
      tpl`\ncomponent:     ${upath.trimExt(variables.fileName)}`;
    // prettier-ignore
    return tpl
`<!--${authorLine}${birthtimeLine}${lastModifiedLine}${componentLine}${companyNameLine}
-->`;

    // like this:
    /*
    <!-- 
    author:        ${variables.authorName} <${variables.authorEmail}>
    date:          ${variables.birthtime}
    lastModified:  ${variables.mtime}
    component: ${upath.trimExt(variables.fileName)}
    Copyright © ${variables.companyName} All rights reserved
    -->
    */
  }
}
