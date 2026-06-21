
const fs = require("fs");
const path = "src/middleware/errorHandler.middleware.ts";
let content = fs.readFileSync(path, "utf-8");
content = content.replace("message,", "message, stack: err.stack,");
fs.writeFileSync(path, content, "utf-8");

