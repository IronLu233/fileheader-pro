import vscode from "vscode";
import { ConfigSection, CONFIG_SECTION_ALL } from "./constants";

class ExtensionConfigManager {
  private get _config() {
    return vscode.workspace.getConfiguration(CONFIG_SECTION_ALL);
  }

  get() {
    return this._config;
  }

  async set(section: ConfigSection, value: any) {
    await this._config.update(section, value);
  }
}

/**
 * @singleton
 */
export const extensionConfigManager = new ExtensionConfigManager();
