# Bytestrone .NET 4.5.1 to .NET 8 Migration

## Overview
A comprehensive workflow codemod designed to automate the heavy lifting of modernizing a monolithic `.NET Framework 4.5.1` application to **.NET 8 (ASP.NET Core)** and **EF Core 8**.

## How It Works
This workflow orchestrates multiple targeted AST (Abstract Syntax Tree) transformations across the entire repository:
1. **Update MVC Namespaces:** Replaces `System.Web.Mvc` with `Microsoft.AspNetCore.Mvc` globally.
2. **Refactor DbContext:** Updates Entity Framework contexts for modern Dependency Injection injection patterns.
3. **Modernize Razor Form Tags:** Converts legacy HTML Helpers (`@Html.BeginForm`) to ASP.NET Core Tag Helpers.
4. **Program.cs Injection:** Safely deletes `Global.asax` and injects a modern, minimal `Program.cs` Kestrel bootstrapper.
5. **Infrastructure Migration:** Extracts connection strings to `appsettings.json` and drastically simplifies legacy XML `.csproj` files into minimal SDK-style projects (`<Project Sdk="Microsoft.NET.Sdk">`).
6. **EF Core Modernization:** Swaps EF6 syntax for EF Core 8 equivalents.

## Limitations
* While this automates repetitive syntax, deep architectural mismatches (such as custom routing constraints, low-level caching like `MemoryCache`, or `HttpContext` fakes) will still require manual compilation fixes post-migration.

## Usage
```bash
npx codemod run bytestrone-net451-to-net8-migration
```
