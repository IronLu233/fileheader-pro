import vscode from "vscode";

class ExtensionConfigManager {
  private get _config() {
    return vscode.workspace.getConfiguration();
  }

  get() {
    return this._config;
  }

  async set(section: string, value: any) {
    await this._config.update(section, value);
  }
}

/**
 * @singleton
 */
export const extensionConfigManager = new ExtensionConfigManager();
