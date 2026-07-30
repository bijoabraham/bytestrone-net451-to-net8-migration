import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  
  // Wipe out Global.asax.cs since Codemod Cloud sandbox blocks new file creation for Program.cs
  const edits = [rootNode.replace(`// TODO: This file was disabled by Codemod.
// Please manually create Program.cs at the root of your project using the standard .NET 8 WebApplicationBuilder template.`)];
  
  return rootNode.commitEdits(edits);
}
export default codemod;
