export { FileheaderLanguageProvider } from "./FileheaderLanguageProvider";
import { PythonFileheaderProvider } from "./PythonFileheaderProvider";
import { TypescriptFileheaderProvider } from "./TypescriptFileheaderProvider";

export const internalProviders = [
  new TypescriptFileheaderProvider(),
  new PythonFileheaderProvider(),
];
