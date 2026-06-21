
const fs = require("fs");
const path = "src/middleware/errorHandler.middleware.ts";
let content = fs.readFileSync(path, "utf-8");
content = content.replace("apiResponse.error(", "require(\"fs\").writeFileSync(\"scratch/api_error.log\", String(err.stack || err)); apiResponse.error(");
fs.writeFileSync(path, content, "utf-8");

