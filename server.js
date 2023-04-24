const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");

const app = express();
app.use(cors());

readdirSync("./router").map((route) =>
    app.use("/", require(`./router/${route}`))
);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is lestining...");
});
