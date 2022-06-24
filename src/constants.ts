import invariant from "invariant";

export const CONFIG_SECTION_ALL = "FileheaderPro" as const;
export enum ExtensionConfigSectionKey {
  userName = "userName",
  userEmail = "userEmail",
  companyName = "companyName",
  dateFormat = "dateFormat",
  disableModifiedTime = "disableModifiedTime",
}
export enum ConfigSection {
  userName = "FileheaderPro.userName",
  userEmail = "FileheaderPro.userEmail",
  companyName = "FileheaderPro.companyName",
  dateFormat = "FileheaderPro.dateFormat",
  disableModifiedTime = 'FileheaderPro.disableModifiedTime',
}

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
