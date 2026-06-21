
require("dotenv").config();
const express = require("express");
const app = express();
const { offerService } = require("./src/services/offer.service");

app.get("/test", async (req, res) => {
  try {
    const page = 1;
    const limit = 20;
    const { data, count } = await offerService.getOffers({ page, limit });
    res.json({ data, count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

const server = app.listen(3001, async () => {
  try {
    const fetch = require("node-fetch");
    const res = await fetch("http://localhost:3001/test");
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});

