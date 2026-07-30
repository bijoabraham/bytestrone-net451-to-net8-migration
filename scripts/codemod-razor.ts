import type { Codemod } from "codemod:ast-grep";
import type Html from "codemod:ast-grep/langs/html";

const codemod: Codemod<Html> = async (root) => {
  const rootNode = root.root();
  
  // Use the 'any' rule to match multiple overloads of Html.BeginForm
  const nodes = rootNode.findAll({ 
    rule: { 
      any: [
        { pattern: "@using (Html.BeginForm()) { $$$BODY }" },
        { pattern: "@using (Html.BeginForm($ACTION, $CONTROLLER)) { $$$BODY }" },
        { pattern: "@using (Html.BeginForm($ACTION, $CONTROLLER, FormMethod.Post)) { $$$BODY }" },
        { pattern: "@using (Html.BeginForm($ACTION, $CONTROLLER, FormMethod.Post, new { $$$ATTRS })) { $$$BODY }" },
        { pattern: "@using (Html.BeginForm($ACTION, $CONTROLLER, FormMethod.Get)) { $$$BODY }" }
      ]
    } 
  });
  
  const edits = nodes.map(node => {
    const actionMatch = node.getMatch("ACTION");
    const controllerMatch = node.getMatch("CONTROLLER");
    
    const action = actionMatch ? ` asp-action=${actionMatch.text()}` : "";
    const controller = controllerMatch ? ` asp-controller=${controllerMatch.text()}` : "";
    
    // Determine method (default to post if FormMethod.Get isn't explicitly used)
    const methodStr = node.text().includes("FormMethod.Get") ? "get" : "post";

    const body = node.getMultipleMatches("BODY").map(n => n.text()).join("");
    
    return node.replace(`<form${action}${controller} method="${methodStr}">\n${body}\n</form>`);
  });
  
  return rootNode.commitEdits(edits);
}
export default codemod;
