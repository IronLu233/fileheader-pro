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
  birthtime: TEMPLATE_WILDCARD_PLACEHOLDER,
  mtime: TEMPLATE_WILDCARD_PLACEHOLDER,
  authorName: TEMPLATE_WILDCARD_PLACEHOLDER,
  authorEmail: TEMPLATE_WILDCARD_PLACEHOLDER,
  userName: TEMPLATE_WILDCARD_PLACEHOLDER,
  userEmail: TEMPLATE_WILDCARD_PLACEHOLDER,
  companyName: TEMPLATE_WILDCARD_PLACEHOLDER,
  projectName: TEMPLATE_WILDCARD_PLACEHOLDER,
  filePath: TEMPLATE_WILDCARD_PLACEHOLDER,
  dirPath: TEMPLATE_WILDCARD_PLACEHOLDER,
  fileName: TEMPLATE_WILDCARD_PLACEHOLDER,
};

export const CUSTOM_TEMPLATE_FILE_NAME = "fileheader.template.js";
