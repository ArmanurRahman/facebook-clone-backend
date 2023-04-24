const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");

const app = express();
app.use(cors());

readdirSync("./router").map((route) =>
    app.use("/", require(`./router/${route}`))
);

app.listen(8000, () => {
    console.log("server is lestining...");
});
