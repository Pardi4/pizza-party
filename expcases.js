const puppeteer = require('puppeteer');
(async () => {
    let XST;

    process.on('message', (message) => {
        const { token } = message;
        XST = token;
    });

    while (!XST) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-software-rasterizer',
        '--no-zygote'
    ]
    });
    const page = await browser.newPage();
    await page.goto('https://g4skins.com', { waitUntil: 'load' });

    async function siteclick(selector) {
        try {
            await page.waitForSelector(selector);
            await new Promise(resolve => setTimeout(resolve, 1000));

            await page.click(selector);
        } catch (error) {
            return "Błąd podczas klikania w element: " + selector + "\n" + error.message;
        }
    }
    async function veryfication() {
        const checkboxSelector = 'input[type="checkbox"]';
        siteclick(checkboxSelector);
    }

    await page.setCookie({
        name: 'x-secure-token',
        value: XST,
        domain: '.g4skins.com',
        expires: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    });
    await page.reload();
    await veryfication();
    const cookieButtonSelector = '#layout_content > div.cookie-wall.open > div.cookie-wall-bar.show > nav > button.G_Button.green';
    await page.waitForSelector(cookieButtonSelector);
    await siteclick(cookieButtonSelector);
    await page.goto('https://g4skins.com/exp-cases');
    const diamondcase = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(6) > div > div.box-owned > div.G_Text > p';
    const platinumcase = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(5) > div > div.box-owned > div.G_Text > p';
    const goldencase = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(4) > div > div.box-owned > div.G_Text > p';
    const silvercase = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(3) > div > div.box-owned > div.G_Text > p';
    const bronze = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(2) > div > div.box-owned> div.G_Text > p';
    const rust = '#layout_content > main > div > div > div.chest-content > div > div.about-keys > div:nth-child(1) > div > div.box-owned > div.G_Text > p';
    const expcases = [diamondcase, platinumcase, goldencase, silvercase, bronze, rust];
    await page.waitForSelector(diamondcase);
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (i = 0; i < expcases.length; i++) {
        const element = await page.$(expcases[i]);
        const text = await page.evaluate(el => el.textContent, element);
        if (text != "NIE POSIADASZ") {
            var bestcase = expcases[i];
            break;
        }

    }
    async function OpenExpCase(link) {
        await page.goto(link)
        await siteclick('#layout_content > main > div > div.case-top > div.top-options > button');
    }
    switch (bestcase) {
        case rust:
            await OpenExpCase("https://g4skins.com/exp-cases/open/rust")
            break;
        case bronze:
            await OpenExpCase("https://g4skins.com/exp-cases/open/bronze")
            break;
        case silvercase:
            await OpenExpCase("https://g4skins.com/exp-cases/open/silver")
            break;
        case goldencase:
            await OpenExpCase("https://g4skins.com/exp-cases/open/golden")
            break;
        case platinumcase:
            await OpenExpCase("https://g4skins.com/exp-cases/open/platinum")
            break;
        case diamondcase:
            await OpenExpCase("https://g4skins.com/exp-cases/open/diamond")
            break;

    }

    await browser.close();
})();

