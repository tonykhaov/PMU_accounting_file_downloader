import dotenv from "dotenv";
import puppeteer from "puppeteer";

dotenv.config();

const { WEBSITE, ACCESS_CODE, PASSWORD, NODE_ENV } = process.env;

(async () => {
  const browser = await puppeteer.launch({ headless: NODE_ENV !== "demo" });
  const page = await browser.newPage();
  await page.goto(WEBSITE);
  await page.setViewport({ width: 640, height: 480, isMobile: true });

  await page.type("input#login.homeInput", ACCESS_CODE);
  await page.keyboard.press("Tab");
  await page.keyboard.type(PASSWORD);
  await page.screenshot({ path: "./dist/screenshots/loginPage.png" });

  await page.click("td.button");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.screenshot({ path: "./dist/screenshots/portalPage.png" });
  console.log("loginPage passed");

  await Promise.all([
    await page.waitForSelector("img.clubAvantage"),
    await page.click("img.clubAvantage"),
    await page.setViewport({ width: 900, height: 798, isMobile: false }),
  ]);
  console.log("portalPage passed"),
    await page.waitForSelector(".dropdown-content");
  await page.screenshot({ path: "./dist/screenshots/homePage.png" });
  await page.click("a#menu_switch");
  console.log("homePage passed");

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.screenshot({ path: "./dist/screenshots/gestionPage.png" });
  console.log("gestionPage passed");

  await page.click(".dropdown a");
  await page.click(".dropdown-content a");
  await page.waitForSelector("tr.month");
  await page.screenshot({ path: "./dist/screenshots/comissionsPage.png" });
  console.log("comissionPage passed");

  const months = await page.$$eval(".month a[href^='#']", (monthRows) =>
    monthRows.map((month) => month.textContent)
  );
  console.log("months:", months);

  await browser.close();
})();
