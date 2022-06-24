import invariant from "invariant";
import { IFileheaderVariables } from "./types";

export const CONFIG_SECTION_ALL = "FileheaderPro" as const;
export enum ExtensionConfigSectionKey {
  userName = "userName",
  userEmail = "userEmail",
  companyName = "companyName",
  dateFormat = "dateFormat",
  disableBirthtime = "disableField.birthtime",
  disabledMtime = "disableField.mtime",
  disableAuthorName = "disableField.authorName",
  disabledAuthorEmail = "disableField.authorEmail",
  disableUserName = "disableField.userName",
  disabledUserEmail = "disableField.userEmail",
  disableCompanyName = "disableField.companyName",
  disableProjectName = "disableField.projectName",
  disableFilePath = "disableField.filePath",
  disableDirPath = "disableField.dirPath",
  disableFileName = "disableField.fileName",
}

export enum ConfigSection {
  userName = "FileheaderPro.userName",
  userEmail = "FileheaderPro.userEmail",
  companyName = "FileheaderPro.companyName",
  dateFormat = "FileheaderPro.dateFormat",
  disableBirthtime = "FileheaderPro.disableField.birthtime",
  disabledMtime = "FileheaderPro.disableField.mtime",
  disableAuthorName = "FileheaderPro.disableField.authorName",
  disabledAuthorEmail = "FileheaderPro.disableField.authorEmail",
  disableUserName = "FileheaderPro.disableField.userName",
  disableUserEmail = "FileheaderPro.disableField.userEmail",
  disableCompanyName = "FileheaderPro.disableField.companyName",
  disableProjectName = "FileheaderPro.disableField.projectName",
  disableFilePath = "FileheaderPro.disableField.filePath",
  disableDirPath = "FileheaderPro.disableField.dirPath",
  disableFileName = "FileheaderPro.disableField.fileName",
}

export const TEMPLATE_SYMBOL_KEY = Symbol.for("template");

export const TEMPLATE_WILDCARD_PLACEHOLDER = "可莉世界第一可爱";

export const WILDCARD_ACCESS_VARIABLES: Readonly<
  Required<IFileheaderVariables>
> = {
  birthTime: TEMPLATE_WILDCARD_PLACEHOLDER,
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

invariant(
  ConfigSection.userName ===
    `${CONFIG_SECTION_ALL}.${ExtensionConfigSectionKey.userName}`,
  "ConfigSection.userName must be equal to ExtensionConfigSectionKey.userName"
);
invariant(
  ConfigSection.userEmail ===
    `${CONFIG_SECTION_ALL}.${ExtensionConfigSectionKey.userEmail}`,
  "ConfigSection.userEmail must be equal to ExtensionConfigSectionKey.userEmail"
);
invariant(
  ConfigSection.companyName ===
    `${CONFIG_SECTION_ALL}.${ExtensionConfigSectionKey.companyName}`,
  "ConfigSection.companyName must be equal to ExtensionConfigSectionKey.companyName"
);
invariant(
  ConfigSection.dateFormat ===
    `${CONFIG_SECTION_ALL}.${ExtensionConfigSectionKey.dateFormat}`,
  "ConfigSection.dateFormat must be equal to ExtensionConfigSectionKey.dateFormat"
);
