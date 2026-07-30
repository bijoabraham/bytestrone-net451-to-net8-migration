import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  const nodes = rootNode.findAll({ rule: { pattern: "using System.Web.Mvc;" } });
  const edits = nodes.map(node => node.replace("using Microsoft.AspNetCore.Mvc;"));
  return rootNode.commitEdits(edits);
}
export default codemod;
