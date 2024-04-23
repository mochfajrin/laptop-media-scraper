import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs/promises";
import { readFileSync, existsSync } from "fs";
import getOneGpuApi from "./utils/getOneGpuApi";

puppeteer.use(StealthPlugin());

function getgpus() {
  const gpusBuffer: Buffer = readFileSync("./data/laptop-media-gpu-list-api.json");
  const gpus = JSON.parse(gpusBuffer.toString());
  return gpus;
}

async function sleep(ms: number): Promise<NodeJS.Timeout> {
  return setTimeout(() => {}, ms);
}

const gpus = getgpus();

interface option {
  override?: boolean;
  verbose?: boolean;
}

async function main(
  path: string,
  gpus: Array<any>,
  option: option = { override: false, verbose: false }
): Promise<any> {
  let gpuData = gpus;
  const scrapped = [];
  const checkFile = existsSync(path);
  if (checkFile && !option.override) {
    throw new Error("File already exists!, use override paramater to override file!");
  }
  if (option.override) {
    const prevDataBuffer = await fs.readFile(path);
    const prevData: Array<any> = JSON.parse(prevDataBuffer.toString());
    gpuData = gpuData.slice(prevData.length, gpus.length);
    scrapped.push(...prevData);
  }

  try {
    for (const gpu of gpuData) {
      await sleep(2000);
      const gpuDetail = await getOneGpuApi(gpu.url);
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

main("./data/laptop-media-gpu-full-api-spec.test.json", gpus, {
  verbose: true,
  override: true,
});
