
const http = require("http");
http.get("http://localhost:3000/api/v1/offers?page=1&limit=20", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => console.log(data));
});

