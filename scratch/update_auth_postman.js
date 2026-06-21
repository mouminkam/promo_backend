
const fs = require("fs");

let data = fs.readFileSync("promoo_postman_collection.json", "utf-8");
let collection = JSON.parse(data);

function updateRequest(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    if (item.item) {
      updateRequest(item.item);
    } else if (item.request) {
      const name = item.name.toLowerCase();
      
      // Update OAuth
      if (name.includes("oauth") || item.request.url.raw.includes("auth/oauth")) {
        item.request.url.raw = "{{baseUrl}}/auth/login/oauth";
        item.request.url.path = ["auth", "login", "oauth"];
      }
      
      // Update Verify OTP
      if (item.request.url.raw.includes("auth/verify") || item.request.url.raw.includes("auth/otp/verify")) {
        item.request.url.raw = "{{baseUrl}}/auth/verify-otp";
        item.request.url.path = ["auth", "verify-otp"];
        item.name = "Verify OTP";
      }

      // Remove otp/send (since we use login/phone or register/phone to send OTP)
      if (item.request.url.raw.includes("auth/otp/send")) {
        items.splice(i, 1);
        continue;
      }
    }
  }
}

updateRequest(collection.item);
fs.writeFileSync("promoo_postman_collection.json", JSON.stringify(collection, null, 2), "utf-8");
console.log("Auth routes in Postman collection updated successfully!");

