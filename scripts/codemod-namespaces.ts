import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  
  // 1. Swap MVC
  const mvcNodes = rootNode.findAll({ rule: { pattern: "using System.Web.Mvc;" } });
  const mvcEdits = mvcNodes.map(node => node.replace("using Microsoft.AspNetCore.Mvc;"));
  
  // 2. Swap EF
  const efNodes = rootNode.findAll({ rule: { pattern: "using System.Data.Entity;" } });
  const efEdits = efNodes.map(node => node.replace("using Microsoft.EntityFrameworkCore;"));
  
  // 3. Swap EF ModelConfiguration
  const efModelNodes = rootNode.findAll({ rule: { pattern: "using System.Data.Entity.ModelConfiguration;" } });
  const efModelEdits = efModelNodes.map(node => node.replace("using Microsoft.EntityFrameworkCore.Metadata.Builders;"));
  
  return rootNode.commitEdits([...mvcEdits, ...efEdits, ...efModelEdits]);
}
export default codemod;
