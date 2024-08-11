const express = require("express");
var ibm_db = require("ibm_db");
var settings = require("./settings");

var db_con_str =
    "DRIVER={DB2}" +
    ";DATABASE=" +
    settings.dbname +
    ";HOSTNAME=" +
    settings.host +
    ";PORT=" +
    settings.port +
    ";PROTOCOL=TCPIP" +
    ";UID=" +
    settings.username +
    ";PWD=" +
    settings.password;

const app = express();
const port = 3000;

var strage = {
    id: 0,
    message: "デフォルトメッセージ",
};
const strages = [strage];

function dbtest() {
    console.log("server_log: test2");
    var sql_str = "select id, data from table1";
    ibm_db.open(db_con_str, function (err, conn) {
        if (err) return console.log(err);
        conn.query(sql_str, function (err, data) {
            if (err) console.log(err);
            console.log(data);
            conn.close(function () {
                console.log("done");
            });
        });
    });
}

app.get("/msg/get", function (req, res, next) {
    dbtest();
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
