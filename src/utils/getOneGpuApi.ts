import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

puppeteer.use(StealthPlugin());

const url: string =
  "https://www.notebookcheck.net/NVIDIA-GeForce-RTX-4090-Laptop-GPU-Benchmarks-and-Specs.675091.0.html";

export default async function getOneGpuApi(url: string): Promise<any> {
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
    const apis = $("tbody>tr>td:contains(API)").next().text().split(",");
    const directXVer =
      apis
        .filter((api) => {
          return api.includes("DirectX");
        })[0]
        ?.trim() || "";
    const openGLVer =
      apis
        .filter((api) => {
          return api.includes("OpenGL");
        })[0]
        ?.trim() || "";

    return { direct_x_version: directXVer, open_gl: openGLVer };
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
}
