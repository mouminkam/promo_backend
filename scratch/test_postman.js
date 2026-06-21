
const data = require("../promoo_postman_collection.json");
const chats = data.item.find(i => i.name === "Chats");
if (chats) {
  chats.item.forEach(i => console.log(i.name, i.request.url.raw));
} else {
  console.log("No Chats folder found");
}

