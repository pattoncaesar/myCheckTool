const func = require('./lib/func.js');
const puppeteer = require('puppeteer');


// const targetUrl = 'https://ranking-deli.jp/8/list/';
// const targetUrl = 'https://ranking-deli.jp/8/local180/';
const targetUrl = 'https://ranking-deli.jp/8/local161/station1663/';
const targetSelector = 'body > main > div.u-container.u-spaceBetween > div.l-mainColumn > section > div > section > div.head > div > h3 > span > a';
const target_findout = 'body';


var browser, page, sub_page, response = null;

(async () => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    page.setViewport({width: 1280, height: 926});
// await page.emulate(iPhonex);
// await page.authenticate({username: user, password: pass});
    await page.goto(targetUrl, {waitUntil: 'load', timeout: 50000});
    await page.waitFor('img');

    sub_page = await browser.newPage();
    sub_page.setViewport({width: 1280, height: 926});
// await sub_page.emulate(iPhonex);
// await sub_page.authenticate({username: user, password: pass});
    await sub_page.goto(targetUrl, {waitUntil: 'load', timeout: 50000});
    await sub_page.waitFor('img');

    var dump_data = [];
    var target_Urls = await page.$$eval(targetSelector, e => e.map((el) => el.href));
    console.log(target_Urls.length);

    for (const url of target_Urls) {
        var body_class = await func.goto_findout(sub_page, url, target_findout, node => node.className);

        console.log(url + '     :     ' + body_class);
        dump_data = dump_data.concat([
            {'url': url, 'body_class': body_class}
        ]);

        await page.waitFor(1000);
    }

    //  write to file
    var fs = require('fs');
    var file = fs.createWriteStream('crawler_dump.txt');
    file.on('error', function (err) {
        Console.log(err)
    });
    dump_data.forEach(value => file.write(`${value.url}\t\t\t${value.body_class}\r\n`));
    file.end();

    //  close puppeteer
    browser.close();
})();