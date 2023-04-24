const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

readdirSync("./router").map((route) =>
    app.use("/", require(`./router/${route}`))
);

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("connect to database");
    })
    .catch((error) => {
        console.log(error);
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is lestining...");
});
