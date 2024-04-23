import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs/promises";
import { readFileSync } from "fs";
import getOneGpu from "./utils/getOneGpu";

puppeteer.use(StealthPlugin());

function getGpus() {
  const gpuBuffer: Buffer = readFileSync("./data/laptop-media-gpu-list.json");
  const gpus = JSON.parse(gpuBuffer.toString());
  return gpus;
}

async function sleep(ms: number): Promise<NodeJS.Timeout> {
  return setTimeout(() => {}, ms);
}

const gpus = getGpus();

interface option {
  overwrite?: boolean;
  verbose?: boolean;
}

async function main(
  path: string,
  gpus: Array<any>,
  prevDataPath?: string,
  option: option = { overwrite: false, verbose: false }
): Promise<any> {
  let gpuData = gpus;
  const scrapped = [];

  if (option.overwrite && prevDataPath) {
    const prevDataBuffer = await fs.readFile(prevDataPath);
    const prevData: Array<any> = JSON.parse(prevDataBuffer.toString());
    gpuData = gpuData.slice(prevData.length, gpus.length);
    scrapped.push(...gpuData);
  }

  try {
    for (const gpu of gpus) {
      await sleep(2000);
      const gpuDetail = await getOneGpu(gpu.url);
      const data = { ...gpu, ...gpuDetail };
      scrapped.push(data);
      const totalScrapped = scrapped.length;
      const totalgpu = gpus.length;
      const percentage = Math.floor((totalScrapped / totalgpu) * 100);

      if (option.verbose) {
        console.info(data);
      }
      console.info(`Total scrapped: ${totalScrapped} from ${totalgpu}`);
      console.info(`Scrapped progress: ${percentage}%`);
      await fs.writeFile(path, JSON.stringify(scrapped));
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.info("Operation finished");
  }
}

main("./data/laptop-media-gpu-full-spec.json", gpus, "", {
  verbose: true,
});
