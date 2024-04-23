import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

puppeteer.use(StealthPlugin());

const url: string = "https://laptopmedia.com/processor/amd-ryzen-9-7945hx/";

export default async function getOneCpu(url: string): Promise<any> {
  const timeout: number = 60 * 60 * 1000;
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    protocolTimeout: timeout,
    args: [
      "--disable-gpu",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
      "--disable-features=site-per-process",
    ],
  });

  try {
    const page = await browser.newPage();
    const timeout: number = 30 * 60 * 1000;
    await page.goto(url, { timeout });
    const html: string = await page.evaluate(() => document.documentElement.innerHTML);
    const $: CheerioAPI = cheerio.load(html);

    const cpuSpeed = $(".col-1-specs>ul>li:contains(Base / Max CPU frequency)")
      .next()
      .text()
      .replace("GHz", "")
      .split("-");
    const coreThreads = $(".col-1-specs>ul>li:contains(Cores)").next().text().split("/");

    const baseSpeed = Number(cpuSpeed[0].trim());
    const maxSpeed = Number(cpuSpeed[1].trim());
    const cores = Number(coreThreads[0].trim());
    const threads = Number(coreThreads[1].trim());

    return {
      base_speed: baseSpeed,
      max_speed: maxSpeed,
      cores,
      threads,
    };
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
}

getOneCpu(url);
