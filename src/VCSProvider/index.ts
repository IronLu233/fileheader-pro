import invariant from "invariant";
import { extensionConfigManager } from "../ExtensionConfigManager";
import { BaseVCSProvider } from "./BaseVCSProvider";
import { GitVCSProvider } from "./GitVCSProvider";

// eslint-disable-next-line @typescript-eslint/naming-convention
let VCSProvider: BaseVCSProvider = null as any;

//TODO: get provider from workspace path
if (extensionConfigManager.get().get("VCSProvider", "Git") === "Git") {
  VCSProvider = new GitVCSProvider();
}

invariant(VCSProvider, "VCSProvider is not found.");

export { VCSProvider };
