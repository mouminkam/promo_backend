
fetch("http://localhost:3000/api/v1/offers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "categoryId": "20361ed2-ab58-427a-ad12-a8ace962b09f",
    "title": "Offer 1",
    "description": "Desc",
    "offerPrice": 100,
    "startDate": "2026-06-01T00:00:00Z"
  })
}).then(res => res.json()).then(console.log).catch(console.error);

