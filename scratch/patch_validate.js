
const fs = require("fs");
const path = "src/middleware/validate.middleware.ts";
let content = fs.readFileSync(path, "utf-8");
content = content.replace("next(error);", "require(\"fs\").writeFileSync(\"scratch/api_error.log\", error.stack); next(error);");
fs.writeFileSync(path, content, "utf-8");

