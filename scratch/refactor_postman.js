
const fs = require("fs");

const file = "promoo_postman_collection.json";
if (!fs.existsSync(file)) {
  console.log("No postman collection found.");
  process.exit(0);
}

const raw = fs.readFileSync(file, "utf8");
let data = JSON.parse(raw);

function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeys(item));
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = toSnakeCase(key);
        newObj[snakeKey] = convertKeys(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

function processItems(items) {
  for (const item of items) {
    if (item.item) {
      processItems(item.item);
    } else if (item.request && item.request.body && item.request.body.mode === "raw") {
      try {
        const bodyObj = JSON.parse(item.request.body.raw);
        const snakeBodyObj = convertKeys(bodyObj);
        item.request.body.raw = JSON.stringify(snakeBodyObj, null, 2);
        console.log(`Converted body for: ${item.name}`);
      } catch (e) {
        // Not a JSON body or invalid JSON
      }
    }
  }
}

if (data.item) {
  processItems(data.item);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  console.log("Postman collection unified to snake_case successfully.");
}

