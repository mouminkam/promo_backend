
const fs = require("fs");
const path = "src/controllers/offer.controller.ts";
let content = fs.readFileSync(path, "utf-8");
content = content.replace(/next\(error\);/g, "require(\"fs\").appendFileSync(\"scratch/api_error.log\", error.stack + \"\\n\"); next(error);");
fs.writeFileSync(path, content, "utf-8");

