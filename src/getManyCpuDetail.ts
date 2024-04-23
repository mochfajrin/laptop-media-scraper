import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import getOneCpu from "./utils/getOneCpu";
import fs from "fs/promises";
import { readFileSync } from "fs";

puppeteer.use(StealthPlugin());

function getCpus() {
  const cpusBuffer: Buffer = readFileSync("./data/laptop-media-cpu-list.json");
  const cpus = JSON.parse(cpusBuffer.toString());
  return cpus;
}

async function sleep(ms: number): Promise<NodeJS.Timeout> {
  return setTimeout(() => {}, ms);
}

const cpus = getCpus();

interface option {
  overwrite?: boolean;
  verbose?: boolean;
}

async function main(
  path: string,
  cpus: Array<any>,
  prevDataPath?: string,
  option: option = { overwrite: false, verbose: false }
): Promise<any> {
  let cpuData = cpus;
  const scrapped = [];

  if (option.overwrite && prevDataPath) {
    const prevDataBuffer = await fs.readFile(prevDataPath);
    const prevData: Array<any> = JSON.parse(prevDataBuffer.toString());
    cpuData = cpuData.slice(prevData.length, cpus.length);
    scrapped.push(...cpuData);
  }

  try {
    for (const cpu of cpus) {
      await sleep(2000);
      const cpuDetail = await getOneCpu(cpu.url);
      const data = { ...cpu, ...cpuDetail };
      scrapped.push(data);
      const totalScrapped = scrapped.length;
      const totalcpu = cpus.length;
      const percentage = Math.floor((totalScrapped / totalcpu) * 100);

      if (option.verbose) {
        console.info(data);
      }
      console.info(`Total scrapped: ${totalScrapped} from ${totalcpu}`);
      console.info(`Scrapped progress; ${percentage}%`);
      await fs.writeFile(path, JSON.stringify(scrapped));
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.info("Operation finished");
  }
}

main("./data/laptop-media-cpu-full-spec.json", cpus, "", {
  verbose: true,
});
