import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";

puppeteer.use(StealthPlugin());

export default async function getAllOs(url: string) {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();
  try {
    await page.goto(url);
    const html = await page.evaluate(() => document.documentElement.innerHTML);
    const $ = cheerio.load(html);
    const windows = $("body tbody")
      .first()
      .find("tr")
      .map(function () {
        const name: string = $(this)
          .find("td:eq(0)")
          .text()
          .trim()
          .replace(/ *\[[^\]]*]/, "");

        const release_date: string = $(this).find("td:eq(2)").text().trim();
        const version = $(this)
          .find("td:eq(3)")
          .text()
          .trim()
          .replace(/ *\[[^\]]*]/, "");
        const build_number: number | string = $(this)
          .find("td:eq(5)")
          .text()
          .trim()
          .replace(/\D/g, "");
        return {
          id: uuid(),
          name,
          release_date,
          version,
          build_number,
        };
      })
      .get();
    const filtered = windows.filter((e) => e.name.includes("Windows"));
    console.log(filtered);

    await fs.writeFile("./data/os-list-1.json", JSON.stringify(windows));
  } catch (err) {
    console.error(err);
  } finally {
    browser.close();
  }
}

getAllOs("https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions");
