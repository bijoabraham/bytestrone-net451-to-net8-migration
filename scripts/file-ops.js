const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
console.log("Running custom file operations in:", cwd);

// 1. Disable Global.asax.cs
const globalAsaxPath = path.join(cwd, "Customer_List", "Global.asax.cs");
if (fs.existsSync(globalAsaxPath)) {
    fs.writeFileSync(globalAsaxPath, "// TODO: This file was disabled by Codemod.\n// Please manually create Program.cs at the root of your project using the standard .NET 8 WebApplicationBuilder template.\n");
    console.log("Disabled Global.asax.cs");
}

// 2. Delete Properties/AssemblyInfo.cs
const assemblyInfoPath = path.join(cwd, "Customer_List", "Properties", "AssemblyInfo.cs");
if (fs.existsSync(assemblyInfoPath)) {
    fs.unlinkSync(assemblyInfoPath);
    console.log("Deleted AssemblyInfo.cs");
}

// 3. Create Program.cs
const programCsPath = path.join(cwd, "Customer_List", "Program.cs");
const programCsContent = `using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using CustomersWebDemo.DbAccess;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<CustomerEntitiesDbContext>(options =>
    options.UseSqlServer("Server=localhost;Database=Customers;Trusted_Connection=True;TrustServerCertificate=True;"));

var app = builder.Build();
app.MapControllers();
app.Run();
`;
fs.writeFileSync(programCsPath, programCsContent);
console.log("Created Program.cs");

// 4. Update Customer_List.csproj to .NET 8 SDK-style
const csprojPath = path.join(cwd, "Customer_List", "Customer_List.csproj");
if (fs.existsSync(csprojPath)) {
    const csprojContent = `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>CustomersWebDemo</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
  </ItemGroup>
</Project>`;
    fs.writeFileSync(csprojPath, csprojContent);
    console.log("Updated Customer_List.csproj");
}
