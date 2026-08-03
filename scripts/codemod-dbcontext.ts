import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  
  // Legacy DbContext
  const nodes = rootNode.findAll({ rule: { pattern: "private CustomerEntitiesDbContext $VAR = new CustomerEntitiesDbContext();" } });
  const edits = nodes.map(node => {
    const varName = node.getMatch("VAR")?.text();
    return node.replace(`private readonly CustomerEntitiesDbContext ${varName};`);
  });
  
  // Autofac to Microsoft DI
  const autofacNodes = rootNode.findAll({ rule: { pattern: "builder.RegisterType<$T>().As<$I>().InstancePerLifetimeScope();" } });
  const autofacEdits = autofacNodes.map(node => {
    const tMatch = node.getMatch("T")?.text() || "";
    const iMatch = node.getMatch("I")?.text() || "";
    return node.replace(`services.AddScoped<${iMatch}, ${tMatch}>();`);
  });
  
  return rootNode.commitEdits([...edits, ...autofacEdits]);
}
export default codemod;

