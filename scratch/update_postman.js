
const fs = require("fs");

let data = fs.readFileSync("promoo_postman_collection.json", "utf-8");
let collection = JSON.parse(data);

function updateRequest(items) {
  for (let item of items) {
    if (item.item) {
      updateRequest(item.item);
    } else if (item.request) {
      const name = item.name.toLowerCase();
      
      // Update Followers Route
      if (name.includes("followers") && item.request.url.raw.includes("profiles/:profileId/followers")) {
        item.request.url.raw = "{{baseUrl}}/follows/followers/:profileId";
        item.request.url.path = ["follows", "followers", ":profileId"];
      }
      
      // Update Following Route
      if (name.includes("following") && item.request.url.raw.includes("profiles/:profileId/following")) {
        item.request.url.raw = "{{baseUrl}}/follows/following/:profileId";
        item.request.url.path = ["follows", "following", ":profileId"];
      }

      // Update Offers by Profile Route
      if (name.includes("offers by profile") || (name.includes("offers") && item.request.url.raw.includes("profiles/:profileId/offers"))) {
        item.request.url.raw = "{{baseUrl}}/offers/profile/:profileId";
        item.request.url.path = ["offers", "profile", ":profileId"];
      }
      
      // Update Ads by Profile Route
      if (name.includes("ads by profile") || (name.includes("ads") && item.request.url.raw.includes("profiles/:profileId/ads"))) {
        item.request.url.raw = "{{baseUrl}}/ads/profile/:profileId";
        item.request.url.path = ["ads", "profile", ":profileId"];
      }

      // Update Create Offer body
      if (name === "create offer" && item.request.body && item.request.body.mode === "raw") {
        try {
          let bodyData = JSON.parse(item.request.body.raw);
          if (bodyData.categoryId) {
            bodyData.category_id = bodyData.categoryId;
            delete bodyData.categoryId;
          }
          if (bodyData.offerPrice) {
            bodyData.offer_price = bodyData.offerPrice;
            delete bodyData.offerPrice;
          }
          if (bodyData.startDate) {
            bodyData.start_date = bodyData.startDate;
            delete bodyData.startDate;
          }
          if (bodyData.description && bodyData.description.length < 10) {
            bodyData.description = "This is a detailed description of the offer that passes the validator.";
          }
          item.request.body.raw = JSON.stringify(bodyData, null, 2);
        } catch (e) {}
      }
    }
  }
}

updateRequest(collection.item);
fs.writeFileSync("promoo_postman_collection.json", JSON.stringify(collection, null, 2), "utf-8");
console.log("Postman collection updated successfully!");

