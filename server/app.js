const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

require("dotenv").config();
app.use(express.json({ limit: "50mb" }));

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../static/index.html"))
);

app.use("/api/auth", require("./api/auth"));

app.get("/api/businesses/:lat/:lng", async (req, res, next) => {
  const { lat, lng } = req.params;

  try {
    const url = `https://api.yelp.com/v3/businesses/search?sort_by=distance&limit=50&latitude=${lat}&longitude=${lng}`;
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });
    res.send(
      data.businesses.filter((business) => business.is_closed === false)
    );
  } catch (error) {
    next(error);
  }
});

module.exports = app;
