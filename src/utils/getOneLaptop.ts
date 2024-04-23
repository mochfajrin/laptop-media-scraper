import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

puppeteer.use(StealthPlugin());

export default async function getOneLaptop(url: string): Promise<any> {
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

    const osName: string = $(".lm-gpu-model:contains(OS)").text().replace("OS", "").trim();
    const gamingScore: number =
      Number($(".lm-gauge .block:contains(Gaming)").prev().text().trim()) || 0;
    const workstationRate: number = Number(
      $(".lm-gauge .block:contains(Workstation)").prev().text().trim() || 0
    );
    const laptopGallery: Array<string> = $(".lm-laptop-gallery .grid>a")
      .map(function () {
        const laptop: string | undefined = $(this).attr("href");
        return laptop;
      })
      .get();

    return {
      os_name: osName,
      gaming_score: gamingScore,
      workstation_rate: workstationRate,
      gallery: laptopGallery,
    };
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
}
