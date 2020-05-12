const fs = require("fs")
let puppeteer = require('puppeteer');
let cFile = process.argv[2];
let pFile = process.argv[3];

(async () => {
    let data = await fs.promises.readFile(cFile);
    let celebData = await fs.promises.readFile(pFile);
    let { url, pwd, user } = JSON.parse(data);
    let celebList = JSON.parse(celebData);
    // console.log(celebList);
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"]
    })
    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[name=username]", { visible: true });
    await page.waitForSelector("input[name=password]", { visible: true });
    await page.type("input[name=username]", user, { delay: 100 });
    await page.type("input[name=password]", pwd, { delay: 100 });
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.click(".L3NKy")
    ]);

    //*******************************************************SEARCH CELEBRITY************************//
    for (let i = 0; i <= celebList.length - 1; i++) {
        await page.waitForSelector(".XTCLo.x3qfX", { visible: true });
        await page.type(".XTCLo.x3qfX", celebList[i].name, { delay: 100 });
        await page.waitForSelector(".fuqBx a.yCE8d", { visible: true });
        let links = await page.$$(".fuqBx a.yCE8d")
        let link = await page.evaluate(function (nxtBtn) {
            return nxtBtn.getAttribute("href");
        }, links[0]);
        await page.goto(`https://www.instagram.com${link}`)
        let ft = Date.now() + 1 * 1000;
        while (Date.now() < ft) {
        }
        // await page.waitForSelector("._6VtSN", { visible: true });
        //**************************FOLLOW CELEB****************************************************//
        if (await page.$("._6VtSN") !== null) {
            await page.click("._6VtSN")
        } else {
            await page.click(".BY3EC.sqdOP.L3NKy.y3zKF")
        }
        //*****************************LIKE POST*******************************************************//
        await page.waitForSelector(".u7YqG", { visible: true });
        await page.click(".u7YqG")
        await page.waitForSelector("svg[aria-label=\"Like\"]", { visible: true });
        await page.click("svg[aria-label=\"Like\"]")
        await page.waitForSelector("svg[aria-label=\"Like\"]", { visible: true });
        await page.click("svg[aria-label=\"Close\"]")
    }
    await browser.close();
})()