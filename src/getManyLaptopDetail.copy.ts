import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Formatedlaptop } from "./interfaces/laptop.type";
import getOneLaptop from "./utils/getOneLaptop";
import fs from "fs/promises";
import { readFileSync, existsSync } from "fs";

puppeteer.use(StealthPlugin());

function getLaptops(): Array<Formatedlaptop> {
  const laptopsBuffer: Buffer = readFileSync("./data/laptops/link/laptop-media-link-list-5.json");
  const laptops: Array<Formatedlaptop> = JSON.parse(laptopsBuffer.toString());
  return laptops;
}

async function sleep(ms: number): Promise<NodeJS.Timeout> {
  return setTimeout(() => {}, ms);
}

const laptops: Array<Formatedlaptop> = getLaptops();

interface option {
  override?: boolean;
  verbose?: boolean;
}

async function main(
  path: string,
  laptops: Array<Formatedlaptop>,
  option: option = { override: false, verbose: false }
): Promise<any> {
  let scrapped = [];
  const laptopLength = laptops.length;

  console.info("check existing file...");
  const isExists = existsSync(path);
  if (!option.override && isExists) {
    throw new Error("File already exists, do you want to override the file?");
  }
  if (option.override && isExists) {
    console.info("start override data...");
    const prevDataBuffer = await fs.readFile(path);
    const prevData: Array<Formatedlaptop> = JSON.parse(prevDataBuffer.toString());
    scrapped.push(...prevData);
    laptops = laptops.slice(scrapped.length, laptops.length);
  }
  console.info("begin to scarape data");
  try {
    for (const laptop of laptops) {
      await sleep(2000);
      const laptopDetail = await getOneLaptop(laptop.url);
      const data = { ...laptop, ...laptopDetail };
      scrapped.push(data);
      const totalScrapped = scrapped.length;
      const percentage = Math.floor((totalScrapped / laptopLength) * 100);

      if (option.verbose) {
        console.info(data);
      }

      console.info(`Total scrapped: ${totalScrapped} from ${laptopLength}`);
      console.info(`Scrapped progress: ${percentage}%`);

      await fs.writeFile(path, JSON.stringify(scrapped));
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.info("Operation finished");
  }
}

main("./data/laptops/results/laptop-media-full-spec-5.json", laptops, {
  verbose: true,
  override: true,
});
