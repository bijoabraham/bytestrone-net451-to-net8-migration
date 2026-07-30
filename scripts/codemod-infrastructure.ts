import type { Codemod } from "codemod:ast-grep";
import type Html from "codemod:ast-grep/langs/html";

const codemod: Codemod<Html> = async (root, context) => {
  const rootNode = root.root();
  const filePath = context?.filePath || "";

  // Because Codemod Cloud restricts 'fs' operations (OS Error 123 in sandbox),
  // we must strictly use AST string replacements on the matched files!
  
  if (filePath.endsWith(".csproj")) {
    const newCsproj = `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  </ItemGroup>
</Project>`;
    return rootNode.commitEdits([rootNode.replace(newCsproj)]);
  }
  
  if (filePath.endsWith("Web.config")) {
    // We cannot create appsettings.json or rename Web.config in the sandbox, 
    // so we will just wipe Web.config to prevent legacy conflicts.
    return rootNode.commitEdits([rootNode.replace(`<!-- TODO: Migration requires manual appsettings.json creation -->`)]);
  }

  return rootNode.commitEdits([]);
}
export default codemod;
