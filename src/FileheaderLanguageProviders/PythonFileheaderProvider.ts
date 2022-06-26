/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-26 17:10:03
 */
import { IFileheaderVariables, ITemplateFunction } from "../types";
import { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";

export class PythonFileheaderProvider extends FileheaderLanguageProvider {
  languages: string[] = ["python"];

  blockCommentStart: string = "/*";
  blockCommentEnd: string = "*/";

  override getTemplate(
    tpl: ITemplateFunction,
    variables: IFileheaderVariables
  ) {
    // prettier-ignore
    return tpl
`'''
@author:        ${variables.authorName} <${variables.authorEmail}>
@date:          ${variables.birthtime}
@lastModified:  ${variables.mtime}
Copyright © ${variables.companyName} All rights reserved
'''`;
  }
}
