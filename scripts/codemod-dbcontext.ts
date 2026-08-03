import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  let text = rootNode.text();
  
  // 1. Rename DbModelBuilder to ModelBuilder
  text = text.replace(/DbModelBuilder/g, "ModelBuilder");
  
  // 2. Remove IObjectContextAdapter casts
  // Example: ((IObjectContextAdapter)this).ObjectContext -> this
  text = text.replace(/\(\(IObjectContextAdapter\)([a-zA-Z0-9_]+)\)\.ObjectContext/g, "$1");
  
  // 3. Simple Autofac to Microsoft DI conversions
  text = text.replace(/builder\.RegisterType<([a-zA-Z0-9_]+)>\(\)\.As<([a-zA-Z0-9_]+)>\(\)\.InstancePerLifetimeScope\(\);/g, "services.AddScoped<$2, $1>();");
  
  if (text !== rootNode.text()) {
    return rootNode.commitEdits([rootNode.replace(text)]);
  }
  
  return rootNode.commitEdits([]);
}
export default codemod;

