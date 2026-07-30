import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  const rootNode = root.root();
  let text = rootNode.text();
  
  // 1. Swap Namespaces
  text = text.replace(/using System\.Data\.Entity;/g, "using Microsoft.EntityFrameworkCore;");
  text = text.replace(/using System\.Data\.Entity\.ModelConfiguration;/g, "using Microsoft.EntityFrameworkCore;\nusing Microsoft.EntityFrameworkCore.Metadata.Builders;");
  
  // 2. Refactor DbContext and Builder Syntax
  text = text.replace(/DbModelBuilder/g, "ModelBuilder");
  text = text.replace(/base\.SaveChanges\(\);/g, "this.SaveChanges();");
  
  // 3. Refactor Entity Configurations (Fluent API)
  text = text.replace(/EntityTypeConfiguration</g, "IEntityTypeConfiguration<");
  text = text.replace(/public CustomerConfiguration\(\)/g, "public void Configure(EntityTypeBuilder<Customer> builder)");
  text = text.replace(/ToTable\(/g, "builder.ToTable(");
  text = text.replace(/Property\(/g, "builder.Property(");
  text = text.replace(/HasDatabaseGeneratedOption\(DatabaseGeneratedOption\.Identity\)/g, "ValueGeneratedOnAdd()");
  
  // 4. Clean up Legacy Database Initializers (DropCreateDatabaseAlways is obsolete)
  text = text.replace(/public class CustomerDatabaseInitializer : DropCreateDatabaseAlways<CustomerEntitiesDbContext>/g, "public class CustomerDatabaseInitializer");
  text = text.replace(/protected override void Seed\(CustomerEntitiesDbContext context\)/g, "public void Seed(CustomerEntitiesDbContext context)");
  text = text.replace(/base\.Seed\(context\);/g, "");

  // If text was modified, apply the replacement to the AST Root
  if (text !== rootNode.text()) {
    return rootNode.commitEdits([rootNode.replace(text)]);
  }
  
  return rootNode.commitEdits([]);
}
export default codemod;
