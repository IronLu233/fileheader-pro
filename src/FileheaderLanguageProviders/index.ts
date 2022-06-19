export { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";
import { TypescriptFileheaderProvider } from "./TypescriptFileheaderProvider";

export const internalProviders = [new TypescriptFileheaderProvider()];
