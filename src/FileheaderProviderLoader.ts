import {
  TypescriptFileheaderProvider,
  FileheaderLanguageProvider,
} from "./Providers";

const providers: FileheaderLanguageProvider[] = [
  new TypescriptFileheaderProvider(),
];

class FileheaderProviderLoader {
  private _internalProviders: FileheaderLanguageProvider[] = providers;

  public async loadProviders(): Promise<FileheaderLanguageProvider[]> {
    const customProviders = await this._loadCustomProvers();
    return [...this._internalProviders, ...customProviders];
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
