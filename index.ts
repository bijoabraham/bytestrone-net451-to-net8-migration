export default function transform(fileInfo, api) {
  let source = fileInfo.source;

  // 1. Scaffold API
  source = source.replace(/class (\w+) : Controller/g, '[ApiController]\n[Route("api/[controller]")]\nclass $1 : ControllerBase');
  
  // 2. Action Result
  source = source.replace(/public ActionResult/g, 'public IActionResult');
  
  // 3. View Returns
  source = source.replace(/return View\(\);/g, 'return Ok();');
  source = source.replace(/return View\((.*?)\);/g, 'return Ok($1);');
  
  // 4. Http Verbs
  source = source.replace(/public IActionResult Index\(\)/g, '[HttpGet]\npublic IActionResult Index()');

  return source;
}
