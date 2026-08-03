import type { Codemod } from "codemod:ast-grep";
import type JavaScript from "codemod:ast-grep/langs/javascript";

const codemod: Codemod<JavaScript> = async (root, context) => {
  const rootNode = root.root();
  const filePath = context?.filePath || "";
  let text = rootNode.text();

  if (filePath.endsWith(".csproj")) {
    // Only process legacy csproj files
    if (text.includes('ToolsVersion="12.0"')) {
      // Determine SDK type based on filename
      const isWeb = filePath.endsWith("Nop.Web.csproj") || filePath.endsWith("Nop.Admin.csproj");
      const sdkType = isWeb ? "Microsoft.NET.Sdk.Web" : "Microsoft.NET.Sdk";

      // Extract ProjectReferences using a global regex match
      const projRefRegex = /<ProjectReference\s+Include="([^"]+)">/g;
      const projRefs: string[] = [];
      let match;
      while ((match = projRefRegex.exec(text)) !== null) {
        projRefs.push(`    <ProjectReference Include="${match[1]}" />`);
      }

      // Build the new modern csproj content
      const itemGroup = projRefs.length > 0 ? `\n  <ItemGroup>\n${projRefs.join("\n")}\n  </ItemGroup>\n` : "";
      
      const newCsproj = `<Project Sdk="${sdkType}">\n  <PropertyGroup>\n    <TargetFramework>net8.0</TargetFramework>\n  </PropertyGroup>\n${itemGroup}</Project>`;
      
      return rootNode.commitEdits([rootNode.replace(newCsproj)]);
    }
  }

  return rootNode.commitEdits([]);
}
export default codemod;
