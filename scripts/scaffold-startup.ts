import * as fs from 'fs';
import * as path from 'path';

export default function scaffoldStartup(options: any) {
  const programCsContent = `using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
`;

  const appSettingsContent = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`;

  const targetDir = options.target || process.cwd();
  
  fs.writeFileSync(path.join(targetDir, 'Program.cs'), programCsContent);
  console.log('Successfully scaffolded Program.cs');
  
  fs.writeFileSync(path.join(targetDir, 'appsettings.json'), appSettingsContent);
  console.log('Successfully scaffolded appsettings.json');
}
