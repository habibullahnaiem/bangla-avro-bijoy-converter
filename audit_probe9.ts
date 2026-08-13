import { convertToUnicode } from "/home/ubuntu/bangla-avro-bijoy-converter/client/src/lib/converter";
console.log("direct:", convertToUnicode("GLbB"));
import("./client/src/lib/converter").then(m => console.log("dynamic:", m.convertToUnicode("GLbB")));
