import invariant from "invariant";

export const CONFIG_SECTION_ALL = "neoFileheader" as const;
export enum ExtensionConfigSectionKey {
  getAuthorCommand = "getAuthorCommand",
  getCurrentUserCommand = "getCurrentUserCommand",
  companyName = "companyName",
  dateFormat = "dateFormat",
  useOriginAuthor = "useOriginAuthor",
}
export enum ConfigSection {
  getAuthorCommand = "neoFileheader.getAuthorCommand",
  getCurrentUserCommand = "neoFileheader.getCurrentUserCommand",
  companyName = "neoFileheader.companyName",
  dateFormat = "neoFileheader.dateFormat",
  useOriginAuthor = "neoFileheader.useOriginAuthor",
}

invariant(
  CONFIG_SECTION_ALL + ExtensionConfigSectionKey.getAuthorCommand ===
    ConfigSection.getAuthorCommand,
  "CONFIG_SECTION_ALL + ExtensionConfigSectionKey.getAuthorCommand === ConfigSection.getAuthorCommand"
);
invariant(
  CONFIG_SECTION_ALL + ExtensionConfigSectionKey.getCurrentUserCommand ===
    ConfigSection.getCurrentUserCommand,
  "CONFIG_SECTION_ALL + ExtensionConfigSectionKey.getCurrentUserCommand === ConfigSection.getCurrentUserCommand"
);
invariant(
  CONFIG_SECTION_ALL + ExtensionConfigSectionKey.companyName ===
    ConfigSection.companyName,
  "CONFIG_SECTION_ALL + ExtensionConfigSectionKey.companyName === ConfigSection.companyName"
);
invariant(
  CONFIG_SECTION_ALL + ExtensionConfigSectionKey.dateFormat ===
    ConfigSection.dateFormat,
  "CONFIG_SECTION_ALL + ExtensionConfigSectionKey.dateFormat === ConfigSection.dateFormat"
);
invariant(
  CONFIG_SECTION_ALL + ExtensionConfigSectionKey.useOriginAuthor ===
    ConfigSection.useOriginAuthor,
  "CONFIG_SECTION_ALL + ExtensionConfigSectionKey.useOriginAuthor === ConfigSection.useOriginAuthor"
);
