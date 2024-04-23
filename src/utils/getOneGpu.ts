import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

puppeteer.use(StealthPlugin());

const url: string = "https://laptopmedia.com/video-card/nvidia-geforce-rtx-3050-ti-laptop-95w/";

export default async function getOneGpu(url: string): Promise<any> {
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
    const baseSpeed = Number(
      $(".col-1-specs>ul>li:contains(Base frequency)").next().text().replace(/\D/g, "")
    );
    const maxSpeed = Number(
      $(".col-2-specs>ul>li:contains(Maximum frequency)").next().text().replace(/\D/g, "")
    );
    const memorySpeed = Number(
      $(".col-1-specs>ul>li:contains(Memory Frequency)").next().text().replace(/\D/g, "")
    );
    const powerConsumption = Number(
      $(".col-2-specs>ul>li:contains(Power consumption)").next().text().replace(/\D/g, "")
    );
    const cores = Number($(".col-2-specs>ul>li:contains(Cores)").next().text().replace(/\D/g, ""));
    const memory = Number(
      $(".col-2-specs>ul>li:contains(Memory Capacity)").next().text().replace(/\D/g, "")
    );
    const memoryBus = Number(
      $(".col-2-specs>ul>li:contains(Memory bus)").next().text().replace(/\D/g, "")
    );

    return { baseSpeed, maxSpeed, memorySpeed, powerConsumption, cores, memory, memoryBus };
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
}

getOneGpu(url);
