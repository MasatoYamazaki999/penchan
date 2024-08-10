const express = require("express");
const app = express();
const port = 3000;

var strage = {
    id: 0,
    message: "デフォルトメッセージ",
};
const strages = [strage];

app.get("/msg/get", function (req, res, next) {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.status(200);
    res.json({
        status: 200,
        response: "メッセージリストを返却",
        messages: strages,
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
