import * as cheerio from "cheerio";
import fs from "fs/promises";
import axios from "axios";

export default async function getAllGpu(url: string) {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const gpuLink = $("tbody>tr")
      .map(function () {
        const name = $(this)
          .find("td:eq(1)")
          .text()
          .replace(/[{()}]/g, "");
        const url = $(this).find("td:eq(1) a").attr("href");
        if (name && url) {
          return {
            name,
            url,
          };
        }
      })
      .get();

    await fs.writeFile("./data/laptop-media-gpu-list-api.json", JSON.stringify(gpuLink));
  } catch (err: any) {
    throw new Error(err);
  } finally {
  }
}

getAllGpu("https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html");
