var express = require("express");
var router = express.Router();

var strage = {
    id: 0,
    message: "デフォルトメッセージ",
};

const strages = [strage];

/**
 * HTTP の GET メソッドを待ち受けてステータスコードと文字列, メッセージリストを返す
 * レスポンスは下記のJSONフォーマットで返却する
 * {
 *   status: 200,
 *   response: 'メッセージリストを返却',
 *   messages: {{メッセージリスト}}
 * }
 * といった JSON が返却される
 */
router.get("/message/get", function (req, res, next) {
    res.status(200);
    res.json({
        status: 200,
        response: "メッセージリストを返却",
        messages: strages,
    });
});

module.exports = router;
