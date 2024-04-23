import fs from "fs";

const cpuBuffer = fs.readFileSync("./data/laptop-media-gpu-list.json");
const parsed: Array<any> = JSON.parse(cpuBuffer.toString());

const raw_name = parsed.map((e) => {
  const rawName = e.name
    .replace(/\s*\(.*?\)\s*/g, "")
    .split(",")[0]
    .trim();
  return {
    ...e,
    raw_name: rawName,
  };
});

console.info(raw_name[0]);

fs.writeFileSync("./data/laptop-media-raw-gpu-list.json", JSON.stringify(raw_name));
