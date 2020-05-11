let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio")
request("http://www.brandwatch.com/blog/top-most-instagram-followers/",
    function (err, res, html) {
        if (err == null && res.statusCode == 200) {
            parseHtml(html);
        } else if (res.statusCode == 404) {
            console.log("page not found");
        } else {
            console.log("err");
            console.log(res.statusCode);
        }
    }
);
function parseHtml(html) {
    let $ = cheerio.load(html);
    let celebrities = []
    $(".relative h2 a").each(function (i, ele) {
        celebrities.push($(ele).attr('href'))
    })
    // console.log(celebrities)
    let instaIds = celebrities.map(cel => cel.split("/").pop())
    // console.log(instaIds)

    let JsonArray = []
    for (let i = instaIds.length - 1; i >= 0; i--) {
        JsonArray.push({ "idx": instaIds.length - 1 - i, "name": instaIds[i] })
    }
    // console.log(JSON.stringify(JsonArray));
    fs.writeFileSync("celebrities.js", JSON.stringify(JsonArray));
}
