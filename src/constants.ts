/*
#### ########   #######  ##    ## ##       ##     ##  #######   #######   #######  
 ##  ##     ## ##     ## ###   ## ##       ##     ## ##     ## ##     ## ##     ## 
 ##  ##     ## ##     ## ####  ## ##       ##     ##        ##        ##        ## 
 ##  ########  ##     ## ## ## ## ##       ##     ##  #######   #######   #######  
 ##  ##   ##   ##     ## ##  #### ##       ##     ## ##               ##        ## 
 ##  ##    ##  ##     ## ##   ### ##       ##     ## ##        ##     ## ##     ## 
#### ##     ##  #######  ##    ## ########  #######  #########  #######   #######  

 * @author        IronLu233 <lrironsora@gmail.com>
 * @date          2022-06-15 22:52:43
 */
import { IFileheaderVariables } from "./types";

export enum ConfigSection {
  userName = "FileheaderPro.userName",
  userEmail = "FileheaderPro.userEmail",
  companyName = "FileheaderPro.companyName",
  dateFormat = "FileheaderPro.dateFormat",
  autoInsertOnCreateFile = "FileheaderPro.autoInsertOnCreateFile",
  autoUpdateOnSave = "FileheaderPro.autoUpdateOnSave",
}

export const TEMPLATE_SYMBOL_KEY = Symbol.for("template");

export const TEMPLATE_WILDCARD_PLACEHOLDER = "可莉世界第一可爱";

export const WILDCARD_ACCESS_VARIABLES: Readonly<
  Required<IFileheaderVariables>
> = {
  birthtime: `${TEMPLATE_WILDCARD_PLACEHOLDER}_birthtime_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  mtime: `${TEMPLATE_WILDCARD_PLACEHOLDER}_mtime_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  authorName: `${TEMPLATE_WILDCARD_PLACEHOLDER}_authorName_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  authorEmail: `${TEMPLATE_WILDCARD_PLACEHOLDER}_authorEmail_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  userName: `${TEMPLATE_WILDCARD_PLACEHOLDER}_userName_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  userEmail: `${TEMPLATE_WILDCARD_PLACEHOLDER}_userEmail_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  companyName: `${TEMPLATE_WILDCARD_PLACEHOLDER}_companyName_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  projectName: `${TEMPLATE_WILDCARD_PLACEHOLDER}_projectName_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  filePath: `${TEMPLATE_WILDCARD_PLACEHOLDER}_filePath_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  dirPath: `${TEMPLATE_WILDCARD_PLACEHOLDER}_dirPath_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
  fileName: `${TEMPLATE_WILDCARD_PLACEHOLDER}_fileName_${TEMPLATE_WILDCARD_PLACEHOLDER}`,
};

export const CUSTOM_TEMPLATE_FILE_NAME = "fileheader.template.js";
