const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const faker = require("faker");
let link = "";

const recaptcha = RecaptchaPlugin();
puppeteer.use(recaptcha);

puppeteer.use(StealthPlugin());
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "PUT2CAPTCHATOKENHERE",
    },
    visualFeedback: true,
  })
);

const domainEndings = ["test.site"];

const loginUrl =
  "https://accounts.google.com/AccountChooser?service=mail&continue=https://google.com&hl=en";
const botRun = async (members) => {
  const chromeOptions = {
    slowMo: 10,
    executablePath: "/usr/bin/google-chrome",
    headless: false,
    cacheControl: "max-age=5",
    dnt: "1",
    XSSAuditingEnabled: true,
    loadImages: false,
    loadPlugins: false,
    secFetchDest: "document",
    upgradeInsecureRequests: "1",
    args: [
      "--fast-start",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
      "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
      "--no-sandbox",
      "--enable-webgl",
      "--disable-web-security",
      "--disable-notifications",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-popup-blocking",
      "--start-maximized",
      "--window-size=800,800",
      "--disable-infobars",
    ],
    ignoreHTTPSErrors: true,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8",
    AcceptLanguage: "en,en-US;q=0,5",
  };

  const browser = await puppeteer.launch(chromeOptions);

  const page = (await browser.pages())[0];

  let run = true;
  while (run) {
    try {
      await Promise.all(page.map((pages) => pages.close()));
      await browser.close();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"
      );
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en,en-US;q=0,5",
      });

      await page.setJavaScriptEnabled(true);
      await page.setDefaultNavigationTimeout(0);
      const browser = await puppeteer.launch(chromeOptions);
      const page = (await browser.pages())[0];
      await page.setRequestInterception(true);
      await page.setBypassCSP(true);
    } catch (error) {}

    try {
      console.log("Going to Uefa");
      await page.goto("https://championsleague-sales.tickets.uefa.com/");

      try {
        await page.waitForSelector("#onetrust-accept-btn-handler", {
          timeout: 4000,
        });
        await page.click("#onetrust-accept-btn-handler", { timeout: 1000 });
      } catch (error) {}
    } catch (e) {}

    try {
      console.log("loggin in");

      await login(page, members);
    } catch (e) {
      console.log("Eror loggin in");
    }
  }
};

(async function main() {
  botRun();
})();

async function login(page, members) {
  let name = faker.name.findName();
  console.log(name);
  name = name.split(" ");
  const firstName = name[0];
  const lastName = name[1];
  const address = faker.address.streetAddress();
  const emailAddress = `${firstName}${lastName}@${
    domainEndings[getRandomInt(domainEndings.length)]
  }`;
  const dob = getDateOfBirth();

  try {
  } catch (error) {
    console.log(error);
  }

  try {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    await page.waitForSelector(
      "#idp-static-page-wrapper_content > #gigya-login-screen > #gigya-login-form > .gigya-layout-row > .gigya-composite-control-link"
    );
    await page.click(
      "#idp-static-page-wrapper_content > #gigya-login-screen > #gigya-login-form > .gigya-layout-row > .gigya-composite-control-link"
    );
  } catch (error) {}

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");

  await page.waitForSelector("#gigya-textbox-75074230944436030");
  await page.type("#gigya-textbox-75074230944436030", emailAddress);

  await page.type("#gigya-password-59919533498235100", "password123!P23$");

  await page.waitForSelector("#gigya-textbox-30497114450394400");
  await page.click("#gigya-textbox-30497114450394400");
  await page.type("#gigya-textbox-130722358975432270", firstName);

  await page.type("#gigya-textbox-30497114450394400", lastName);

  await page.waitForSelector("#gigya-textbox-88315185881230510");
  await page.click("#gigya-textbox-88315185881230510");

  await page.type("#gigya-textbox-88315185881230510", "15");

  await page.type("#gigya-textbox-105406014904922500", "02");
  await page.type("#gigya-textbox-32538633360993784", "1991");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  console.log("aaa");

  try {
    await page.waitForSelector("#gigya-checkbox-terms");
    console.log("bbb");
    await page.click("#gigya-checkbox-terms");
    console.log("ccc");
    await page.waitForSelector(
      "#gigya-register-screen > #gigya-register-form > .gigya-layout-row > .gigya-composite-control > .gigya-input-submit"
    );
    console.log("ddd");
    await page.click(
      "#gigya-register-screen > #gigya-register-form > .gigya-layout-row > .gigya-composite-control > .gigya-input-submit"
    );
    //gigya-screen-caption
    while (link === "") {
      await new Promise((res) => setTimeout(() => res(true), 10000));
      console.log("waiting");
      const imageFrame = page
        .frames()
        .find(
          (frame) =>
            frame.url() ===
            "https://www.google.com/recaptcha/api2/bframe?hl=en&v=4PnKmGB9wRHh1i04o7YUICeI&k=6LehfZUbAAAAAJhue_6BVqqxLulLiXLP0rEgpdRH"
        );
      let a = await imageFrame.content();
      await page.solveRecaptchas();
    }

    console.log(link);
    await page.waitForTimeout(40000);
    await page.goto(link, { waitUntil: "networkidle2" });
    let register = false;
    while (register === false) {
      let start;
      try {
        await page.waitForSelector(
          ".tickets__comp--2014 > .tickets__col > .tickets__boxes > .tickets__box > .btn"
        );
        await page.click(
          ".tickets__comp--2014 > .tickets__col > .tickets__boxes > .tickets__box > .btn"
        );
        start = true;
      } catch (error) {}
      try {
        await page.waitForSelector("#onetrust-accept-btn-handler", {
          timeout: 2000,
        });
        await page.click("#onetrust-accept-btn-handler", { timeout: 1500 });
        start = true;
      } catch (error) {}
      try {
        if (start === true) {
          register = true;
        }
      } catch (error) {}
    }

    console.log("---- eran finished =====");
  } catch (error) {}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getDateOfBirth() {
  const initialDay = Math.floor(Math.random() * (29 - 1) + 1).toString();
  const day = initialDay.length === 2 ? initialDay : `0${initialDay}`;
  const initialMonth = Math.floor(Math.random() * (13 - 1) + 1).toString();
  const month = initialMonth.length === 2 ? initialMonth : `0${initialMonth}`;
  const year = Math.floor(Math.random() * (1998 - 1950) + 1950).toString();
  return { day, month, year };
}
