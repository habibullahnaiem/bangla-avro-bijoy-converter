import { convertToBijoy, mapSegmentsToBijoy } from "./client/src/lib/converter";

const samples = [
  "“উদ্ধৃতি”",
  "‘উদ্ধৃতি’",
  "“উদ্ধৃতি’",
  "‘উদ্ধৃতি”",
  "\"উদ্ধৃতি\"",
  "'উদ্ধৃতি'",
  "“Bangla”",
  "‘Bangla’",
];

for (const source of samples) {
  const bijoy = convertToBijoy(source);
  const segments = mapSegmentsToBijoy(source, "u2b");
  const codes = Array.from(bijoy)
    .map((char) => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");
  console.log(JSON.stringify({ source, bijoy, codes, segments }));
}
