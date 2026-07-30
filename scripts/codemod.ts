import type { Codemod } from "codemod:ast-grep";
import type CSharp from "codemod:ast-grep/langs/c_sharp";

const codemod: Codemod<CSharp> = async (root) => {
  let source = root.root().text();

  // 1. Scaffold API
  source = source.replace(/class (\w+) : Controller/g, '[ApiController]\r\n    [Route("api/[controller]")]\r\n    public class $1 : ControllerBase');
  
  // 2. Controller methods & ActionResult
  source = source.replace(/using System\.Web\.Mvc;/g, 'using Microsoft.AspNetCore.Mvc;');
  source = source.replace(/public ActionResult/g, 'public IActionResult');
  
  // 3. Http Verbs
  source = source.replace(/public IActionResult Index\(\)/g, '[HttpGet]\r\n        public IActionResult Index()');
  source = source.replace(/public IActionResult Details\(int id\)/g, '[HttpGet("{id}")]\r\n        public IActionResult Details(int id)');
  source = source.replace(/public IActionResult CreateEdit\(Customer c\)/g, '[HttpPost]\r\n        public IActionResult CreateEdit([FromBody] Customer c)');
  
  // 4. View Returns
  source = source.replace(/return View\(\);/g, 'return Ok();');
  source = source.replace(/return View\((.*?)\);/g, 'return Ok($1);');
  source = source.replace(/return PartialView\((.*?)\);/g, 'return Ok($1);');

  return source;
}

export default codemod;
