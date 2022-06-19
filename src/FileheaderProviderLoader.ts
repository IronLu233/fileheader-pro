import {
  internalProviders,
  FileheaderLanguageProvider,
} from "./FileheaderLanguageProviders";

class FileheaderProviderLoader {
  public async loadProviders(): Promise<FileheaderLanguageProvider[]> {
    const customProviders = await this._loadCustomProvers();
    return [...internalProviders, ...customProviders];
  }

  private async _loadCustomProvers(): Promise<FileheaderLanguageProvider[]> {
    // not implement
    return [];
  }
}

/**
 * @singleton
 */
export const fileheaderProviderLoader = new FileheaderProviderLoader();
