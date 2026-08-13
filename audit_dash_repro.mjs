// রেপ্রো: convertToBijoy("\u2013") — raw '–' নাকি বিজয়-কোড?
import { convertToBijoy } from "./client/src/lib/converter.ts";
console.log("convertToBijoy('\u2013'):", JSON.stringify(convertToBijoy("\u2013")));
