import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  const nodes = rootNode.findAll({ rule: { pattern: "private CustomerEntitiesDbContext $VAR = new CustomerEntitiesDbContext();" } });
  const edits = nodes.map(node => {
    const varName = node.getMatch("VAR")?.text();
    return node.replace(`private readonly CustomerEntitiesDbContext ${varName};`);
  });
  return rootNode.commitEdits(edits);
}
export default codemod;
