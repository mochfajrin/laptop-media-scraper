import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import fs from "fs/promises";

puppeteer.use(StealthPlugin());

export default async function getAllGpu(url: string) {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();
  try {
    await page.goto(url);
    const html = await page.evaluate(() => document.documentElement.innerHTML);
    const $ = cheerio.load(html);
    const cpus = $("tbody>.cpu-row.w-full")
      .map(function () {
        const id: string = $(this).find("td:eq(0)").text().trim().replace(".", "");
        const name: string = $(this).find("td:eq(1)").text().trim();
        const benchmark_3d: number = Number($(this).find("td:eq(2)").text());
        const price = Number($(this).find("td:eq(4)").text().trim().replace("$", ""));
        const url = $(this).find("a").attr("href");

        return {
          id,
          name,
          benchmark_3d,
          price,
          url,
        };
      })
      .get();
    console.info(cpus[1]);

    await fs.writeFile(
      "./data/laptop-media-gpu-list.json",
      JSON.stringify(cpus.slice(1, cpus.length))
    );
  } catch (err) {
    console.error(err);
  } finally {
    browser.close();
  }
}

getAllGpu("https://laptopmedia.com/top-laptop-graphics-ranking/");
