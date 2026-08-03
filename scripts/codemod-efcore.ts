import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  let text = rootNode.text();
  
  // NopCommerce mappings already have 'using System.Data.Entity;' swapped by the namespace codemod,
  // but we'll add the builders namespace if it's missing (usually handled by namespace codemod, but let's ensure it).
  if (text.includes("IEntityTypeConfiguration<") && !text.includes("using Microsoft.EntityFrameworkCore.Metadata.Builders;")) {
      text = "using Microsoft.EntityFrameworkCore.Metadata.Builders;\n" + text;
  }
  if (text.includes("IEntityTypeConfiguration<") && !text.includes("using Microsoft.EntityFrameworkCore;")) {
      text = "using Microsoft.EntityFrameworkCore;\n" + text;
  }

  // 1. Fix the base class that was broken by the previous run, or if it's pristine
  text = text.replace(/NopI+EntityTypeConfiguration</g, "IEntityTypeConfiguration<");
  text = text.replace(/NopEntityTypeConfiguration</g, "IEntityTypeConfiguration<");

  // 2. Refactor Entity Configurations (Fluent API)
  // Find the constructor e.g., public AffiliateMap()
  text = text.replace(/public partial class ([A-Za-z0-9_]+) : IEntityTypeConfiguration<([A-Za-z0-9_]+)>\s*\{\s*public \1\(\)\s*\{/g, "public partial class $1 : IEntityTypeConfiguration<$2>\n    {\n        public void Configure(EntityTypeBuilder<$2> builder)\n        {");
  
  // 3. Fix fluent API calls
  // Clean up 'this.builder.' if it was broken by previous run
  text = text.replace(/this\.builder\.builder\./g, "builder.");
  text = text.replace(/this\.builder\./g, "builder.");
  
  // Standard replacements
  text = text.replace(/this\.ToTable\(/g, "builder.ToTable(");
  text = text.replace(/this\.HasKey\(/g, "builder.HasKey(");
  text = text.replace(/this\.Property\(/g, "builder.Property(");
  text = text.replace(/this\.Ignore\(/g, "builder.Ignore(");
  
  // Relationships
  text = text.replace(/this\.HasRequired\(/g, "builder.HasOne(");
  text = text.replace(/this\.HasOptional\(/g, "builder.HasOne(");
  text = text.replace(/this\.HasMany\(/g, "builder.HasMany(");
  
  // Cascade Delete
  text = text.replace(/\.WillCascadeOnDelete\(false\)/g, ".OnDelete(DeleteBehavior.Restrict)");
  text = text.replace(/\.WillCascadeOnDelete\(true\)/g, ".OnDelete(DeleteBehavior.Cascade)");
  text = text.replace(/\.WillCascadeOnDelete\(\)/g, ".OnDelete(DeleteBehavior.Cascade)");

  // If text was modified, apply the replacement
  if (text !== rootNode.text()) {
    return rootNode.commitEdits([rootNode.replace(text)]);
  }
  
  return rootNode.commitEdits([]);
}
export default codemod;
