const express = require("express");
const ibm_db = require("ibm_db");
const settings = require("./settings");

const db_con_str =
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

const strage = {
    id: 0,
    message: "デフォルトメッセージ",
};
const strages = [strage];

function getDbData(res) {
    console.log("server_log: test2");
    const sql_str = "select data as dt from table1 where id=1";
    ibm_db.open(db_con_str, function (err, conn) {
        if (err) return console.log(err);
        conn.query(sql_str, function (err, data) {
            if (err) console.log(err);
            res.set({ "Access-Control-Allow-Origin": "*" });
            res.status(200);
            res.json({
                status: 200,
                response: data[0].DT,
                messages: strages,
            });
            conn.close(function () {
                console.log("done");
            });
        });
    });
}

app.get("/msg/get", function (req, res, next) {
    getDbData(res);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
